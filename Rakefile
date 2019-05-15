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

desc 'Run tests using Windows 10 with Edge'
task :windows_10_edge do
  ENV['PLATFORM'] = 'windows_10_edge'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Mac Sierra with Chrome'
task :windows_10_chrome do
  ENV['PLATFORM'] = 'windows_10_chrome'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 7 with Firefox'
task :windows_7_ff do
  ENV['PLATFORM'] = 'windows_7_ff'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Windows 8 with Internet Explorer'
task :windows_8_ie do
  ENV['PLATFORM'] = 'windows_8_ie'
  system 'rspec spec/restricted_input_spec.rb'
end

desc 'Run tests using Mac Mojave with Safari'
task :mac_mojave_safari do
  ENV['PLATFORM'] = 'mac_mojave_safari'
  system 'rspec spec/restricted_input_spec.rb'
end

task :test => [
  :windows_10_edge,
  :windows_10_chrome,
  :windows_7_ff,
  :windows_8_ie,
  :mac_mojave_safari
]

task :default => [:test]
