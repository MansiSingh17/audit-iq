"""
Utility Functions for ML Service
"""
import hashlib
import json
from typing import Any, Dict
from datetime import datetime
from app.utils.logger import get_logger

logger = get_logger(__name__)

def hash_text(text: str) -> str:
    """
    Generate hash for text (used for caching)
    
    Args:
        text: Input text
        
    Returns:
        SHA256 hash of text
    """
    return hashlib.sha256(text.encode()).hexdigest()

def format_timestamp(dt: datetime = None) -> str:
    """
    Format datetime as ISO string
    
    Args:
        dt: Datetime object (defaults to now)
        
    Returns:
        ISO formatted timestamp
    """
    if dt is None:
        dt = datetime.now()
    return dt.isoformat()

def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """
    Safely load JSON with error handling
    
    Args:
        json_str: JSON string
        default: Default value if parsing fails
        
    Returns:
        Parsed JSON or default value
    """
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning(f'JSON parsing failed: {e}')
        return default

def safe_json_dumps(obj: Any, default: str = "{}") -> str:
    """
    Safely dump object to JSON
    
    Args:
        obj: Object to serialize
        default: Default value if serialization fails
        
    Returns:
        JSON string or default value
    """
    try:
        return json.dumps(obj)
    except (TypeError, ValueError) as e:
        logger.warning(f'JSON serialization failed: {e}')
        return default

def create_success_response(data: Dict, message: str = None) -> Dict:
    """
    Create standardized success response
    
    Args:
        data: Response data
        message: Optional message
        
    Returns:
        Formatted response dictionary
    """
    response = {
        'success': True,
        'data': data,
        'timestamp': format_timestamp()
    }
    
    if message:
        response['message'] = message
    
    return response

def create_error_response(error: str, details: Dict = None) -> Dict:
    """
    Create standardized error response
    
    Args:
        error: Error message
        details: Optional error details
        
    Returns:
        Formatted error dictionary
    """
    response = {
        'success': False,
        'error': error,
        'timestamp': format_timestamp()
    }
    
    if details:
        response['details'] = details
    
    return response

def validate_text_input(text: str, min_length: int = 10, max_length: int = 50000) -> tuple:
    """
    Validate text input
    
    Args:
        text: Input text
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not text or not isinstance(text, str):
        return False, "Text input is required and must be a string"
    
    text = text.strip()
    
    if len(text) < min_length:
        return False, f"Text must be at least {min_length} characters long"
    
    if len(text) > max_length:
        return False, f"Text must not exceed {max_length} characters"
    
    return True, None

def calculate_processing_time(start_time: datetime) -> float:
    """
    Calculate processing time in seconds
    
    Args:
        start_time: Start datetime
        
    Returns:
        Processing time in seconds
    """
    end_time = datetime.now()
    delta = end_time - start_time
    return round(delta.total_seconds(), 2)

def truncate_for_display(text: str, max_length: int = 100) -> str:
    """
    Truncate text for display purposes
    
    Args:
        text: Input text
        max_length: Maximum display length
        
    Returns:
        Truncated text with ellipsis if needed
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe storage
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    import re
    # Remove or replace unsafe characters
    filename = re.sub(r'[^\w\s\-\.]', '_', filename)
    # Remove multiple spaces/underscores
    filename = re.sub(r'[\s_]+', '_', filename)
    return filename.strip('_')

def format_percentage(value: float, decimals: int = 1) -> str:
    """
    Format value as percentage
    
    Args:
        value: Value between 0 and 1
        decimals: Number of decimal places
        
    Returns:
        Formatted percentage string
    """
    return f"{value * 100:.{decimals}f}%"

def batch_list(items: list, batch_size: int = 10) -> list:
    """
    Split list into batches
    
    Args:
        items: List of items
        batch_size: Size of each batch
        
    Returns:
        List of batches
    """
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]