def remove_duplicates(file_path):
    # Using a set to track unique lines while preserving order with a list
    seen = set()
    unique_lines = []
    
    # Read the file
    with open(file_path, 'r') as file:
        for line in file:
            # If line is new (not seen before), add to unique_lines and mark as seen
            if line not in seen:
                unique_lines.append(line)
                seen.add(line)
    
    # Rewrite the file with unique lines only
    with open(file_path, 'w') as file:
        file.writelines(unique_lines)
    
    print(f"Duplicates removed and file '{file_path}' updated.")

# Example usage
remove_duplicates('tokens.txt')
