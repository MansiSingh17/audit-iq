"""
AI-Powered Grammar Checker using Claude
Replaces language_tool_python with Claude Sonnet 4.5
"""

import json
from typing import Dict, List
import requests

class GrammarChecker:
    def __init__(self):
        self.api_url = "https://api.anthropic.com/v1/messages"
        
    def check_grammar(self, text: str) -> Dict:
        """
        Check grammar using Claude AI
        Returns corrections with detailed explanations
        """
        try:
            # Prepare the prompt for Claude
            prompt = f"""You are a professional grammar and style checker. Analyze the following text and identify all grammar, spelling, punctuation, and style errors.

For each error found, provide:
1. The incorrect phrase/word
2. The corrected version
3. The type of error (Grammar, Spelling, Punctuation, Style)
4. A brief explanation
5. The position in the text

Text to check:
"{text}"

Return ONLY a JSON object in this exact format (no markdown, no backticks):
{{
  "hasErrors": true/false,
  "correctedText": "fully corrected version",
  "corrections": [
    {{
      "original": "incorrect phrase",
      "corrected": "correct phrase",
      "type": "Grammar/Spelling/Punctuation/Style",
      "message": "explanation of the error",
      "offset": 0,
      "length": 10
    }}
  ]
}}

If no errors found, return:
{{
  "hasErrors": false,
  "correctedText": "same as input",
  "corrections": []
}}"""

            # Call Claude API
            response = requests.post(
                self.api_url,
                headers={
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 2000,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                },
                timeout=30
            )
            
            if response.status_code != 200:
                return self._error_response(text, f"API error: {response.status_code}")
            
            # Parse Claude's response
            claude_response = response.json()
            content = claude_response.get("content", [])
            
            if not content or content[0].get("type") != "text":
                return self._error_response(text, "Invalid response format")
            
            # Extract the JSON from Claude's response
            result_text = content[0].get("text", "")
            
            # Clean up any markdown formatting if present
            result_text = result_text.strip()
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            result_text = result_text.strip()
            
            # Parse the JSON result
            try:
                result = json.loads(result_text)
            except json.JSONDecodeError:
                return self._error_response(text, "Failed to parse grammar check results")
            
            # Format the response
            return {
                "success": result.get("hasErrors", False),
                "originalText": text,
                "correctedText": result.get("correctedText", text),
                "corrections": result.get("corrections", []),
                "suggestions": result.get("corrections", []),
                "error": None
            }
            
        except requests.Timeout:
            return self._error_response(text, "Request timeout")
        except requests.RequestException as e:
            return self._error_response(text, f"Network error: {str(e)}")
        except Exception as e:
            return self._error_response(text, f"Unexpected error: {str(e)}")
    
    def _error_response(self, text: str, error_message: str) -> Dict:
        """Return error response"""
        return {
            "success": False,
            "originalText": text,
            "correctedText": text,
            "corrections": [],
            "suggestions": [],
            "error": error_message
        }


# Example usage and testing
if __name__ == "__main__":
    checker = GrammarChecker()
    
    # Test cases
    test_texts = [
        "Me and my friend was playing football yesterday.",
        "She dont like apples.",
        "This are a test sentence.",
        "The quick brown fox jumps over the lazy dog."  # Correct sentence
    ]
    
    for text in test_texts:
        print(f"\nTesting: {text}")
        print("-" * 60)
        result = checker.check_grammar(text)
        print(f"Has errors: {result['success']}")
        print(f"Corrected: {result['correctedText']}")
        if result['corrections']:
            print("Corrections:")
            for correction in result['corrections']:
                print(f"  - {correction['original']} → {correction['corrected']}")
                print(f"    Type: {correction['type']}, Reason: {correction['message']}")