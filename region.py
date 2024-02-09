# Does not work

import geopandas as gpd
import pandas as pd

# Read the DataFrame from the Excel file
df = pd.read_excel('ngo_data/newer.xlsx')

# Load the GeoJSON file into a GeoDataFrame
geojson_file = 'map_data/Ghana_New_260_District.geojson'
gdf = gpd.read_file(geojson_file)

# Merge the GeoDataFrame with the DataFrame based on a common column representing regions
merged_df = pd.merge(df, gdf, how='left', left_on='Region', right_on='REGION')

# Update the DataFrame based on the spatial relationship between regions and districts
# Update the DataFrame based on the spatial relationship between regions and districts
for region in merged_df['Region'].unique():
    districts = merged_df.loc[merged_df['Region'] == region, 'DISTRICT']
    # Convert each district to a string and filter out NaN values
    districts = [str(district) for district in districts if pd.notnull(district)]
    df.loc[df['Region'] == region, 'District'] = ', '.join(districts)


# Save the updated DataFrame to a new Excel file
df.to_excel('updated_excel_file.xlsx', index=False)
