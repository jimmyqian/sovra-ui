#!/bin/bash

# Script to fix non-null assertion warnings in test files
# Removes the ! operator from array access and property access patterns

# Array of test files to process
test_files=(
    "src/components/common/__tests__/SearchBar.accessibility.test.ts"
    "src/components/search/__tests__/SearchConversation.test.ts"
    "src/components/search/__tests__/PersonProfile.accessibility.test.ts"
    "src/components/search/__tests__/DetailedResultCard.test.ts"
    "src/components/search/__tests__/DetailedResultCard.accessibility.test.ts"
    "src/components/search/__tests__/ResultCard.accessibility.test.ts"
    "src/components/search/__tests__/ResultsList.test.ts"
    "src/components/search/__tests__/FilterCriteria.test.ts"
    "src/components/search/__tests__/PersonProfile.test.ts"
    "src/components/navigation/__tests__/AppSidebar.test.ts"
    "src/components/ui/__tests__/Button.test.ts"
    "src/stores/__tests__/search.test.ts"
    "src/test/integration/SearchConversationWorkflow.test.ts"
    "src/test/integration/HeaderNavigation.test.ts"
    "src/test/integration/FileUploadWorkflow.test.ts"
    "src/test/utils/search.test.ts"
    "src/test/utils/router.test.ts"
    "src/test/utils/types.test.ts"
    "src/test/accessibility/global/keyboard-navigation-patterns.test.ts"
    "src/components/layout/__tests__/AppHeader.test.ts"
    "src/components/layout/__tests__/CopyrightFooter.test.ts"
    "src/components/search/conversation/__tests__/ResultsSummary.test.ts"
    "src/components/search/__tests__/SearchConversation.accessibility.test.ts"
    "src/components/search/__tests__/SearchConversation.new.test.ts"
    "src/test/accessibility/global/theme-contrast-validation.test.ts"
    "src/test/integration/SearchDetailWorkflow.test.ts"
    "src/test/integration/SearchWorkflow.test.ts"
    "src/test/utils/css-component-patterns.test.ts"
    "src/test/utils/css-utilities.test.ts"
    "src/views/__tests__/Landing.test.ts"
)

echo "Starting non-null assertion fixes..."

# Function to fix a file
fix_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "Warning: File $file not found"
        return
    fi
    
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Fix array access patterns like [0]! [1]! etc
    sed -i.tmp 's/\[\([0-9][0-9]*\)\]!/[\1]/g' "$file"
    
    # Fix property access patterns like element!. 
    sed -i.tmp 's/element!/element/g' "$file"
    sed -i.tmp 's/button!/button/g' "$file"
    sed -i.tmp 's/searchButton!/searchButton/g' "$file"
    sed -i.tmp 's/uploadButton!/uploadButton/g' "$file"
    sed -i.tmp 's/micButton!/micButton/g' "$file"
    sed -i.tmp 's/container!/container/g' "$file"
    sed -i.tmp 's/wrapper!/wrapper/g' "$file"
    sed -i.tmp 's/queryDiv!/queryDiv/g' "$file"
    sed -i.tmp 's/userAvatar!/userAvatar/g' "$file"
    sed -i.tmp 's/lastHint!/lastHint/g' "$file"
    sed -i.tmp 's/altText!/altText/g' "$file"
    sed -i.tmp 's/statsContainer!/statsContainer/g' "$file"
    sed -i.tmp 's/imageGallery!/imageGallery/g' "$file"
    sed -i.tmp 's/firstButton!/firstButton/g' "$file"
    sed -i.tmp 's/filterSpan!/filterSpan/g' "$file"
    sed -i.tmp 's/removeButton!/removeButton/g' "$file"
    sed -i.tmp 's/dropdownSpan!/dropdownSpan/g' "$file"
    sed -i.tmp 's/editButton!/editButton/g' "$file"
    sed -i.tmp 's/createButton!/createButton/g' "$file"
    sed -i.tmp 's/resultsContainer!/resultsContainer/g' "$file"
    sed -i.tmp 's/loadMoreContainer!/loadMoreContainer/g' "$file"
    sed -i.tmp 's/headerContainer!/headerContainer/g' "$file"
    sed -i.tmp 's/headerSection!/headerSection/g' "$file"
    sed -i.tmp 's/firstIcon!/firstIcon/g' "$file"
    sed -i.tmp 's/icon!/icon/g' "$file"
    sed -i.tmp 's/searchIcon!/searchIcon/g' "$file"
    
    # Remove temporary file
    rm -f "${file}.tmp"
    
    echo "Fixed $file"
}

# Process all files
for file in "${test_files[@]}"; do
    fix_file "$file"
done

echo "Non-null assertion fixes completed!"
echo "Backup files created with .backup extension"