import requests
import unittest
import os
import json
from datetime import datetime

class FixNetAPITester(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(FixNetAPITester, self).__init__(*args, **kwargs)
        # Get the backend URL from frontend .env file
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.strip().split('=')[1]
                    break
        
        self.api_url = f"{self.base_url}/api"
        print(f"Testing API at: {self.api_url}")

    def test_01_health_check(self):
        """Test the API health check endpoint"""
        print("\n🔍 Testing API health check...")
        response = requests.get(f"{self.api_url}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["message"], "FixNet API v1.0")
        print("✅ API health check passed")

    def test_02_diagnostic(self):
        """Test the diagnostic endpoint"""
        print("\n🔍 Testing diagnostic endpoint...")
        
        # Test screen issue
        screen_data = {"problem_description": "Экран разбился и не работает"}
        response = requests.post(f"{self.api_url}/diagnostic", json=screen_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Проблемы с экраном")
        print("✅ Screen diagnostic test passed")
        
        # Test battery issue
        battery_data = {"problem_description": "Батарея быстро разряжается"}
        response = requests.post(f"{self.api_url}/diagnostic", json=battery_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Проблемы с батареей")
        print("✅ Battery diagnostic test passed")
        
        # Test audio issue
        audio_data = {"problem_description": "Не работает звук в динамике"}
        response = requests.post(f"{self.api_url}/diagnostic", json=audio_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Проблемы со звуком")
        print("✅ Audio diagnostic test passed")
        
        # Test water damage
        water_data = {"problem_description": "Телефон упал в воду и не включается"}
        response = requests.post(f"{self.api_url}/diagnostic", json=water_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Повреждение жидкостью")
        print("✅ Water damage diagnostic test passed")
        
        # Test software issue
        software_data = {"problem_description": "Телефон зависает и тормозит"}
        response = requests.post(f"{self.api_url}/diagnostic", json=software_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Программные проблемы")
        print("✅ Software diagnostic test passed")
        
        # Test default response
        default_data = {"problem_description": "Что-то странное происходит"}
        response = requests.post(f"{self.api_url}/diagnostic", json=default_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["category"], "Общая диагностика")
        print("✅ Default diagnostic test passed")

    def test_03_price_estimate(self):
        """Test the price estimate endpoint"""
        print("\n🔍 Testing price estimate endpoint...")
        
        # Test for Apple screen repair
        apple_data = {"brand": "Apple", "model": "iPhone 14", "problem": "экран разбит"}
        response = requests.post(f"{self.api_url}/price-estimate", json=apple_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("от 8 000 ₽", data["estimated_price"])
        print("✅ Apple screen price estimate test passed")
        
        # Test for Samsung battery repair
        samsung_data = {"brand": "Samsung", "model": "Galaxy S23", "problem": "батарея быстро разряжается"}
        response = requests.post(f"{self.api_url}/price-estimate", json=samsung_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("от 2 500 ₽", data["estimated_price"])
        print("✅ Samsung battery price estimate test passed")
        
        # Test for Xiaomi sound repair
        xiaomi_data = {"brand": "Xiaomi", "model": "Redmi Note 12", "problem": "не работает звук"}
        response = requests.post(f"{self.api_url}/price-estimate", json=xiaomi_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("от 1 500 ₽", data["estimated_price"])
        print("✅ Xiaomi sound price estimate test passed")
        
        # Test for other brand water damage
        other_data = {"brand": "Другие", "model": "OnePlus 11", "problem": "упал в воду"}
        response = requests.post(f"{self.api_url}/price-estimate", json=other_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("от 2 500 ₽", data["estimated_price"])
        print("✅ Other brand water damage price estimate test passed")

    def test_04_repair_request(self):
        """Test the repair request endpoint"""
        print("\n🔍 Testing repair request endpoint...")
        
        # Create a test repair request
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        request_data = {
            "name": f"Test User {timestamp}",
            "contact": f"+7999{timestamp[-7:]}",
            "device_brand": "Apple",
            "device_model": "iPhone 14 Pro",
            "problem_description": "Разбит экран, не работает сенсор",
            "estimated_price": "от 8 000 ₽"
        }
        
        response = requests.post(f"{self.api_url}/repair-request", json=request_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], request_data["name"])
        self.assertEqual(data["contact"], request_data["contact"])
        self.assertEqual(data["device_brand"], request_data["device_brand"])
        self.assertEqual(data["device_model"], request_data["device_model"])
        self.assertEqual(data["problem_description"], request_data["problem_description"])
        self.assertEqual(data["estimated_price"], request_data["estimated_price"])
        self.assertIn("id", data)
        print("✅ Repair request test passed")
        
        # Test getting all repair requests
        response = requests.get(f"{self.api_url}/repair-requests")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        # Check if our test request is in the list
        found = False
        for req in data:
            if req["name"] == request_data["name"] and req["contact"] == request_data["contact"]:
                found = True
                break
        self.assertTrue(found, "Newly created repair request not found in the list")
        print("✅ Get repair requests test passed")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)