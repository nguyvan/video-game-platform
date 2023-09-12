from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from urllib import request

driver = webdriver.Chrome()

driver.get("https://generated.photos/faces")
wait = WebDriverWait(driver, 50)

folders = '../hog-api-ts/src/seeds/avatar/'

def download_image(urls):
	for (index, url) in enumerate(urls):
		request.urlretrieve(url, f'{folders}{index}.png')

def get_url(element):
	image = element.find_element(By.TAG_NAME, 'a').find_element(By.TAG_NAME, 'img').get_attribute('src')
	return image

def fetch_120_images():
	index = 0
	photos = None
	while index < 3:
		driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
		wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'loadmore-btn'))).click()

		time.sleep(5)
		index += 1
		photos = driver.find_elements(By.CLASS_NAME, 'card-image')

	image_urls = list(map(get_url, photos))
	download_image(image_urls)
	


fetch_120_images()