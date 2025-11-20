#!/bin/bash

echo "Testing Electric Era Uptime Calculator"
echo "======================================"
echo ""

# Test input_1
echo "Test 1: input_1.txt"
python3 uptime_calculator.py input_1.txt > output_1.txt
if diff -q output_1.txt input_1_expected_stdout.txt > /dev/null; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    echo "Expected:"
    cat input_1_expected_stdout.txt
    echo "Got:"
    cat output_1.txt
fi
echo ""

# Test input_2
echo "Test 2: input_2.txt"
python3 uptime_calculator.py input_2.txt > output_2.txt
if diff -q output_2.txt input_2_expected_stdout.txt > /dev/null; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    echo "Expected:"
    cat input_2_expected_stdout.txt
    echo "Got:"
    cat output_2.txt
fi
echo ""

# Cleanup
rm -f output_1.txt output_2.txt

echo "Testing complete!"
