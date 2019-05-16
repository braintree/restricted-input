# adapted from https://github.com/saucelabs-sample-test-frameworks/Ruby-RSpec-Capybara/blob/680e533d80fa850a6906dd383d7440367a65bb30/Rakefile
# frozen_string_literal: true

require 'rspec/core/rake_task'

#
# For use in building a unique Build Name for running tests in parallel on Sauce Labs from a local machine
#
ENV['SAUCE_START_TIME'] = "Restricted Input: Local-#{Time.now.to_i}"

#
# Ideally run one of these Rake Tasks in your CI rather than
# setting the 2 ENV variables and executing this command
#

desc 'Run tests using Mac Sierra with Chrome'
task :windows_10_chrome do
  ENV['PLATFORM'] = 'windows_10_chrome'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 10 with Firefox'
task :windows_10_ff do
  ENV['PLATFORM'] = 'windows_10_ff'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 8 with Internet Explorer 9'
task :windows_ie9 do
  ENV['PLATFORM'] = 'windows_ie9'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 8 with Internet Explorer 10'
task :windows_ie10 do
  ENV['PLATFORM'] = 'windows_ie10'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 10 with Internet Explorer 11'
task :windows_ie11 do
  ENV['PLATFORM'] = 'windows_ie11'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Mac Mojave with Safari'
task :mac_mojave_safari do
  ENV['PLATFORM'] = 'mac_mojave_safari'
  system 'rspec spec/restricted_input_spec.rb'
end

desc "Run all internet explorer tests"
task :ie => [
  :windows_ie9,
  :windows_ie10,
  :windows_ie11
]

@build_success = true

desc "Run all browser tests"
multitask test: [
  # :windows_ie9,
  # :windows_ie10,
  # :windows_ie11
  # :windows_10_chrome,
  :windows_10_ff,
  :mac_mojave_safari
] do
  begin
    raise StandardError, 'Tests failed!' unless @build_success
  ensure
    @build_success &= @result
  end
end

task :default => [:test]
