import re


def validate_australian_phone(number: str) -> dict:
    """
    Validate and classify Australian phone numbers.
    
    Accepts various formats including:
    - Mobile: "0412 345 678", "+61 412 345 678"
    - Landline: "(02) 9876 5432", "03 9876 5432"
    - Toll-free: "1800 123 456", "1300 123 456"
    
    Args:
        number: The phone number string to validate
        
    Returns:
        dict: {
            'valid': bool,      # Whether the number is valid
            'formatted': str,   # Normalized format (digits only) or original if invalid
            'type': str         # 'mobile', 'landline', 'tollfree', or 'unknown'
        }
    """
    # Remove all non-digit characters for normalization
    digits_only = re.sub(r'\D', '', number)
    
    # Handle +61 prefix (convert to 0)
    if number.strip().startswith('+61'):
        digits_only = '0' + digits_only[2:]  # Replace +61 with 0
    
    result = {
        'valid': False,
        'formatted': number,
        'type': 'unknown'
    }
    
    # Check for Mobile numbers (starts with 04, 10 digits)
    # Format: 04XX XXX XXX
    if re.match(r'^04\d{8}$', digits_only):
        result['valid'] = True
        result['type'] = 'mobile'
        result['formatted'] = f"{digits_only[:4]} {digits_only[4:7]} {digits_only[7:]}"
        return result
    
    # Check for Landline numbers (area code + 8 digits)
    # Valid area codes: 02, 03, 07, 08
    # Format: (0X) XXXX XXXX or 0X XXXX XXXX
    if re.match(r'^0[2378]\d{8}$', digits_only):
        result['valid'] = True
        result['type'] = 'landline'
        area_code = digits_only[:2]
        result['formatted'] = f"({area_code}) {digits_only[2:6]} {digits_only[6:]}"
        return result
    
    # Check for Toll-free numbers (1800 or 1300 + 6 digits)
    # Format: 1800 XXX XXX or 1300 XXX XXX
    if re.match(r'^(1800|1300)\d{6}$', digits_only):
        result['valid'] = True
        result['type'] = 'tollfree'
        prefix = digits_only[:4]
        result['formatted'] = f"{prefix} {digits_only[4:7]} {digits_only[7:]}"
        return result
    
    # Number didn't match any valid pattern
    return result


# Test cases
if __name__ == "__main__":
    test_numbers = [
        # Mobile numbers
        "0412 345 678",
        "+61 412 345 678",
        "0412345678",
        
        # Landline numbers
        "(02) 9876 5432",
        "03 9876 5432",
        "07 1234 5678",
        "08 8765 4321",
        
        # Toll-free numbers
        "1800 123 456",
        "1300 987 654",
        "1800123456",
        
        # Invalid numbers
        "1234 567 890",   # Invalid prefix
        "9999 999 999",   # Invalid format
        "04 12 345",      # Too short
    ]
    
    print("Australian Phone Number Validator Test Results:")
    print("=" * 60)
    
    for num in test_numbers:
        result = validate_australian_phone(num)
        status = "✓ VALID" if result['valid'] else "✗ INVALID"
        print(f"\nInput:    '{num}'")
        print(f"Status:   {status}")
        print(f"Type:     {result['type']}")
        print(f"Formatted: '{result['formatted']}'")
