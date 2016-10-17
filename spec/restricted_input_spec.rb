HOSTNAME = `hostname`.chomp
PORT = ENV['PORT'] || 3099

describe 'Restricted Input' do
  before :each do
    visit "http://#{HOSTNAME}:#{PORT}"
  end

  describe 'for number' do
    it 'enters a credit card' do
      input = find '#credit-card-number'
      input.send_keys '4111111111111111'
      expect(input.value).to eql('4111 1111 1111 1111')
    end

    it 'only allows digits' do
      input = find '#credit-card-number'
      input.send_keys 'abc'
      input.send_keys 'defghhijklmnopqrstuvwxyz !@#$%^&*()_=+'
      input.send_keys '1234567890123456'
      expect(input.value).to eql('1234 5678 9012 3456')
    end

    it 'limits input size' do
      input = find '#credit-card-number'
      input.send_keys '41111111111111111234567890123456'
      expect(input.value).to eql('4111 1111 1111 1111')
    end

    it 'should enter a space when expected gap' do
      input = find '#credit-card-number'
      input.send_keys '4111'
      expect(input.value).to eql('4111 ')
      input.send_keys '1'
      expect(input.value).to eql('4111 1')
    end

    it 'should keep the space when removing digit after gap' do
      input = find '#credit-card-number'
      input.send_keys '41115'
      expect(input.value).to eql('4111 5')
      input.send_keys :backspace
      expect(input.value).to eql('4111 ')
    end

    it 'backspacing after a gap should change the value' do
      input = find '#credit-card-number'
      input.send_keys '41115'
      expect(input.value).to eql('4111 5')
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('4115 ')
    end

    it 'backspacing before a gap backspaces a character' do
      input = find '#credit-card-number'
      input.send_keys '41115'
      expect(input.value).to eql('4111 5')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('4115 ')
    end

    it 'backspacing the character after a gap should keep the cursor after the gap' do
      input = find '#credit-card-number'
      input.send_keys '411156'
      expect(input.value).to eql('4111 56')
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('4111 6')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'backspacing the character before a gap should backspace the character and move the gap' do
      input = find '#credit-card-number'
      input.send_keys '411156'
      expect(input.value).to eql('4111 56')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('4115 6')
      expect(input['data-selection-start']).to eql('3')
      expect(input['data-selection-end']).to eql('3')
    end

    it 'field overwrites' do
      input = find '#credit-card-number'
      input.send_keys '1111111111111111'
      expect(input.value).to eql('1111 1111 1111 1111')
      19.times { input.send_keys :arrow_left}
      input.send_keys '2222222222222222'
      expect(input.value).to eql('2222 2222 2222 2222')
    end

    it 'can backspace a whole field' do
      input = find '#credit-card-number'
      input.send_keys '1111111111111111'
      expect(input.value).to eql('1111 1111 1111 1111')
      16.times { input.send_keys :backspace }
      expect(input.value).to eql('')
    end

    it 'can backspace in the middle' do
      input = find '#credit-card-number'
      input.send_keys '1234567890123456'
      expect(input.value).to eql('1234 5678 9012 3456')
      11.times { input.send_keys :arrow_left }

      input.send_keys :backspace
      expect(input.value).to eql('1234 5689 0123 456')
    end

    it 'can delete after a gap' do
      input = find '#credit-card-number'
      input.send_keys '123456'
      expect(input.value).to eql('1234 56')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
      input.send_keys :delete
      expect(input.value).to eql('1234 6')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'can delete before a gap' do
      input = find '#credit-card-number'
      input.send_keys '12345'
      expect(input.value).to eql('1234 5')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      expect(input['data-selection-start']).to eql('4')
      expect(input['data-selection-end']).to eql('4')
      input.send_keys :delete
      expect(input.value).to eql('1234 ')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'can prepend the first four digits' do
      input = find '#credit-card-number'
      input.send_keys '412345678'
      expect(input.value).to eql('4123 4567 8')
      expect(input['data-selection-start']).to eql('11')
      expect(input['data-selection-end']).to eql('11')
      input.value.length.times { input.send_keys :arrow_left }
      input.send_keys '0000'
      expect(input.value).to eql('0000 4123 4567 8')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'doesnt overwrite when more digits can fit in the field' do
      input = find '#credit-card-number'
      input.send_keys '1234567'
      expect(input.value).to eql('1234 567')
      expect(input['data-selection-start']).to eql('8')
      expect(input['data-selection-end']).to eql('8')
      input.value.length.times { input.send_keys :arrow_left }
      input.send_keys '0000'
      expect(input.value).to eql('0000 1234 567')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end
  end

  describe 'for amex' do
    it 'enters a credit card' do
      input = find '#credit-card-amex'
      input.send_keys '378211111111111'
      expect(input.value).to eql('3782 111111 11111')
    end

    it 'only allows digits' do
      input = find '#credit-card-amex'
      input.send_keys 'abc'
      input.send_keys 'defghhijklmnopqrstuvwxyz !@#$%^&*()_=+'
      input.send_keys '1234567890123456'
      expect(input.value).to eql('1234 567890 12345')
    end

    it 'limits input size' do
      input = find '#credit-card-amex'
      input.send_keys '3782111111111111234567890123456'
      expect(input.value).to eql('3782 111111 11111')
    end

    it 'should enter a space for expected gap' do
      input = find '#credit-card-amex'
      input.send_keys '3782'
      expect(input.value).to eql('3782 ')
      input.send_keys '1'
      expect(input.value).to eql('3782 1')
    end

    it 'should keep the space when removing digit after gap' do
      input = find '#credit-card-amex'
      input.send_keys '37825'
      expect(input.value).to eql('3782 5')
      input.send_keys :backspace
      expect(input.value).to eql('3782 ')
    end

    it 'backspacing after a gap should change the value' do
      input = find '#credit-card-amex'
      input.send_keys '37828'
      expect(input.value).to eql('3782 8')
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('3788 ')
    end

    it 'backspacing before a gap backspaces a character and fills the gap' do
      input = find '#credit-card-amex'
      input.send_keys '37825'
      expect(input.value).to eql('3782 5')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('3785 ')
    end

    it 'backspacing the character before a gap should backspace the character and move the gap' do
      input = find '#credit-card-amex'
      input.send_keys '378256'
      expect(input.value).to eql('3782 56')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      input.send_keys :backspace
      expect(input.value).to eql('3785 6')
      expect(input['data-selection-start']).to eql('3')
      expect(input['data-selection-end']).to eql('3')
    end

    it 'field overwrites' do
      input = find '#credit-card-amex'
      input.send_keys '111111111111111'
      expect(input.value).to eql('1111 111111 11111')
      17.times { input.send_keys :arrow_left }
      input.send_keys '2222222222222222'
      expect(input.value).to eql('2222 222222 22222')
    end

    it 'can backspace a whole field' do
      input = find '#credit-card-amex'
      input.send_keys '111111111111111'
      expect(input.value).to eql('1111 111111 11111')
      15.times { input.send_keys :backspace }
      expect(input.value).to eql('')
    end

    it 'can backspace in the middle' do
      input = find '#credit-card-amex'
      input.send_keys '123456789012345'
      expect(input.value).to eql('1234 567890 12345')
      10.times { input.send_keys :arrow_left }
      input.send_keys :backspace
      expect(input.value).to eql('1234 578901 2345')
    end

    it 'can delete after a gap' do
      input = find '#credit-card-amex'
      input.send_keys '123456'
      expect(input.value).to eql('1234 56')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
      input.send_keys :delete
      expect(input.value).to eql('1234 6')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'can delete before a gap' do
      input = find '#credit-card-amex'
      input.send_keys '12345'
      expect(input.value).to eql('1234 5')
      input.send_keys :arrow_left
      input.send_keys :arrow_left
      expect(input['data-selection-start']).to eql('4')
      expect(input['data-selection-end']).to eql('4')
      input.send_keys :delete
      expect(input.value).to eql('1234 ')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'can prepend the first four digits' do
      input = find '#credit-card-amex'
      input.send_keys '412345678'
      expect(input.value).to eql('4123 45678')
      expect(input['data-selection-start']).to eql('10')
      expect(input['data-selection-end']).to eql('10')
      input.value.length.times { input.send_keys :arrow_left }
      input.send_keys '0000'
      expect(input.value).to eql('0000 412345 678')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end

    it 'doesnt overwrite when more digits can fit in the field' do
      input = find '#credit-card-amex'
      input.send_keys '1234567'
      expect(input.value).to eql('1234 567')
      expect(input['data-selection-start']).to eql('8')
      expect(input['data-selection-end']).to eql('8')
      input.value.length.times { input.send_keys :arrow_left }
      input.send_keys '0000'
      expect(input.value).to eql('0000 123456 7')
      expect(input['data-selection-start']).to eql('5')
      expect(input['data-selection-end']).to eql('5')
    end
  end

  describe 'for unformatted' do
    it 'enters a credit card' do
      input = find '#credit-card-unformatted'
      input.send_keys '4111111111111111'
      expect(input.value).to eql('4111111111111111')
    end

    it 'only allows digits' do
      input = find '#credit-card-unformatted'
      input.send_keys 'abc'
      input.send_keys 'defghhijklmnopqrstuvwxyz !@#$%^&*()_=+'
      input.send_keys '1234567890123456'
      expect(input.value).to eql('1234567890123456')
    end

    it 'limits input size' do
      input = find '#credit-card-unformatted'
      input.send_keys '41111111111111111234567890123456'
      expect(input.value).to eql('4111111111111111')
    end

    it 'field overwrites' do
      input = find '#credit-card-unformatted'
      input.send_keys '1111111111111111'
      expect(input.value).to eql('1111111111111111')
      16.times { input.send_keys :arrow_left }
      input.send_keys '2222222222222222'
      expect(input.value).to eql('2222222222222222')
    end

    it 'can backspace a whole field' do
      input = find '#credit-card-unformatted'
      input.send_keys '1111111111111111'
      expect(input.value).to eql('1111111111111111')
      16.times { input.send_keys :backspace }
      expect(input.value).to eql('')
    end

    it 'can backspace in the middle' do
      input = find '#credit-card-unformatted'
      input.send_keys '1234567890123456'
      expect(input.value).to eql('1234567890123456')
      9.times { input.send_keys :arrow_left }

      input.send_keys :backspace
      expect(input.value).to eql('123456890123456')
    end
  end

  describe 'for toggle-able' do
    it 'toggles' do
      input = find '#credit-card-toggle-able'
      button = find '#credit-card-toggle-able-btn'

      input.send_keys '4111111111111111'
      expect(input.value).to eql('4111 1111 1111 1111')

      button.click()

      expect(input.value).to eql('4111 111111 11111')
    end
  end

  describe 'wildcard' do
    it 'accepts digits' do
      input = find '#wildcard'
      input.send_keys '3333'
      expect(input.value).to eql('*A*3 3')
    end

    it 'accepts lowercase alpha' do
      input = find '#wildcard'
      input.send_keys 'jjjj'
      expect(input.value).to eql('*A*3 jjj')
    end

    it 'accepts uppercase alpha' do
      input = find '#wildcard'
      input.send_keys 'NNNN'
      expect(input.value).to eql('*A*3 NNN')
    end

    it 'accepts mixed alphanumeric' do
      input = find '#wildcard'
      input.send_keys 'aA33'
      expect(input.value).to eql('*A*3 aA33')
    end
  end
end
