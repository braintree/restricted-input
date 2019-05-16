# adapted from https://github.com/saucelabs-sample-test-frameworks/Ruby-RSpec-Capybara/blob/680e533d80fa850a6906dd383d7440367a65bb30/Rakefile

require 'rspec/core/rake_task'

#
# For use in building a unique Build Name for running tests in parallel on Sauce Labs from a local machine
#
ENV['SAUCE_START_TIME'] = "Restricted Input: Local-#{Time.now.to_i}"

@success = true

PLATFORMS = {
  "windows_ie9" => "Windows 7 IE9",
  "windows_ie10" => "Windows 8.1 IE10",
  "windows_ie11" => "Windows 10 IE11",
  "windows_10_chrome" => "Windows 10 Chrome",
  "windows_10_ff" => "Windows 10 Firefox",
  "mac_mojave_safari" => "Mac OS 10.14 Safari"
}

PLATFORMS.each do |platform_key, browser_name|
  desc "Run tests using #{browser_name}"
  task platform_key do
    ENV['PLATFORM'] = platform_key
    begin
      @result = system 'rspec spec/restricted_input_spec.rb'
    ensure
      @success &= @result
    end
  end
end

desc "Run all browser tests"
multitask test: PLATFORMS.keys do
  begin
    raise StandardError, 'Tests failed!' unless @build_success
  ensure
    @build_success &= @result
  end
end

task :default => [:test]
