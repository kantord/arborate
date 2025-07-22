import pytest

def test_api_demo():
    """Demo test for API functionality"""
    
    test_db = setup_test_database()
    user = {"name": "testuser", "email": "test@example.com"}
    result = create_user_api(user_data)
    assert result is not None
    assert result.status_code == 201
    cleanup_test_database(test_db)
    
    # This test was generated from tree: api-demo
    assert True
