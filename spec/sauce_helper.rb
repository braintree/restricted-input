# File must reside at this location as the path is hardcoded in Sauce Parallel gem
#
# You should edit this file with the browsers you wish to use
# For options, check out http://saucelabs.com/docs/platforms
require "sauce"
require "sauce/capybara"

tunnel_id = "restricted-input"

Capybara.default_driver = :sauce
Sauce.config do |c|
  c[:job_name] = tunnel_id
  c[:application_host] = "https://#{`hostname`}"
  c[:application_port] = 4443
  c[:start_local_application] = false
  c[:start_tunnel] = true
  c[:connect_options] = {
    :tunnel_identifier => tunnel_id,
    :se_port => 4443
  }
  c["tunnel-identifier"] = tunnel_id
  c[:sauce_connect_4_executable] = "./node_modules/sauce-connect-launcher/sc/sc-4.3.13-linux/bin/sc"
  c[:browsers] = [
    ["Windows 10", "chrome", nil],
    # Firefox 48 (latest on Sauce) is failing all tests
    ["Windows 10", "firefox", 47],
    ["OS X 10.11", "safari", nil],
    ["Windows 7", "internet explorer", "9"],
    ["Windows 8", "internet explorer", "10"],
    ["Windows 10", "internet explorer", "11"],
    # ["Linux", "android", nil],
    # ["Linux", "android", "4.4"],
    ["OS X 10.10", "iphone", "9.2"],
  ]
end
