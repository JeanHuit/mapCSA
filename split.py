

import pandas as pd

# Read the Excel file into a pandas DataFrame
df = pd.read_excel('ngo_data/2024_NGO and GVT Dataset.xlsx')

# Define the dictionary to map abbreviated regions to their full names
region_mapping = {
    'AR': 'Ashanti Region',
    'CR': 'Central Region',
    'GA': 'Greater Accra',
    'VR': 'Volta Region',
    'WR': 'Western Region',
    'UWR': 'Upper West Region',
    'WNR': 'Western North Region',
    'NER': 'North East Region',
    'NR1': 'Northern Region',
    'ER': 'Eastern Region',
    'BER': 'Bono East Region',
    'BAR': 'Brong Ahafo Region',
    'BR': 'Bono Region',
    'SR': 'Savannah Region',  # Corrected spelling
    'AhR': 'Ahafo Region',
    'AHR': 'Ahafo Region',
    'UER': 'Upper East Region',
    'NR': 'Northern Region',  
    'BA': 'Brong Ahafo',
    'UE': 'Upper East Region',
    'UW':'Upper West Region',
    'WE': 'Western Region',
    'GR':'Greater Accra',
    'NE': 'North East Region',
    'WN': 'Western North Region',
     'UW(old)':'Upper West Region',
     'UW (old)':'Upper West Region',
     'UE(old)':'Upper East Region',
     'UE (old)':'Upper East Region',
     'BE':'Bono East Region',
     'Norther': 'Northern Region',
     'OR':'Oti Region'
}

# Iterate through each row in the DataFrame
new_rows = []
for index, row in df.iterrows():
    # Check if the 'Region' column contains multiple regions separated by commas
    if ',' in str(row['Region']):
        # Split the regions into a list
        regions = str(row['Region']).split(',')
        # Replace abbreviated versions with full names
        full_regions = [region_mapping.get(region.strip(), region.strip()) for region in regions]
        # Create a new row for each region and assign just one region to the 'Region' column
        for region in full_regions:
            new_row = row.copy()
            new_row['Region'] = region.strip()  # Assign one region
            new_rows.append(new_row)
    else:
        # If the 'Region' column contains a single region, keep the row as it is
        new_rows.append(row)

# Create a new DataFrame with the updated rows
new_df = pd.DataFrame(new_rows)

# Write the new DataFrame to a new Excel file
new_df.to_excel('ngo_data/new.xlsx', index=False)





# Read the Excel file into a pandas DataFrame
df = pd.read_excel('ngo_data/new.xlsx')

# Define the dictionary to map abbreviated regions to their full names
region_mapping = {
    'AR': 'Ashanti Region',
    'CR': 'Central Region',
    'GA': 'Greater Accra',
    'VR': 'Volta Region',
    'WR': 'Western Region',
    'UWR': 'Upper West Region',
    'WNR': 'Western North Region',
    'NER': 'North East Region',
    'NR1': 'Northern Region',
    'ER': 'Eastern Region',
    'BER': 'Bono East Region',
    'BAR': 'Brong Ahafo Region',
    'BR': 'Bono Region',
    'SR': 'Savannah Region',  # Corrected spelling
    'AhR': 'Ahafo Region',
    'AHR': 'Ahafo Region',
    'UER': 'Upper East Region',
    'NR': 'Northern Region',  
    'BA': 'Brong Ahafo',
    'UE': 'Upper East Region',
    'UW':'Upper West Region',
    'WE': 'Western Region',
    'GR':'Greater Accra',
    'NE': 'North East Region',
    'WN': 'Western North Region',
     'UW(old)':'Upper West Region',
     'UW (old)':'Upper West Region',
     'UE(old)':'Upper East Region',
     'UE (old)':'Upper East Region',
     'BE':'Bono East Region',
     'Norther': 'Northern Region',
     'OR':'Oti Region'
}

# Replace any remaining abbreviations with full names in the 'Region' column
df['Region'] = df['Region'].apply(lambda x: region_mapping.get(str(x).strip(), x))

# Write the updated DataFrame to a new Excel file
df.to_excel('ngo_data/newer.xlsx', index=False)
