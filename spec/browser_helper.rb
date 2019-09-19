module Browser
  def browser_pend(browser_name, reason)
    browser = page.driver.browser
    detected_browser_name = browser.browser.to_s

    if (detected_browser_name == browser_name)
      pending(reason)
    end
  end
end
