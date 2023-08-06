import os
import json
import boto3
from google.cloud import firestore
from google.oauth2 import service_account

# Initialize AWS DynamoDB and Google Firestore clients
dynamodb = boto3.client('dynamodb')

# Load GCP service account key from environment variable
GCP_SERVICE_ACCOUNT_KEY_JSON = os.environ.get('GCP_SERVICE_ACCOUNT_KEY_JSON')
if GCP_SERVICE_ACCOUNT_KEY_JSON:
    gcp_credentials = service_account.Credentials.from_service_account_info(json.loads(GCP_SERVICE_ACCOUNT_KEY_JSON))
    firestore_client = firestore.Client(credentials=gcp_credentials)
else:
    raise ValueError("GCP_SERVICE_ACCOUNT_KEY_JSON environment variable not set")

# Table names
DYNAMODB_TABLE_NAME = "TriviaLeaderboard"
FIRESTORE_COLLECTION_NAME = "TriviaLeaderboard"

def lambda_handler(event, context):
    print(event['Records'])
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            # Get the new item added to DynamoDB
            new_item = record['dynamodb']['NewImage']
            
            # Extract the primary key value to use as the Firestore document ID
            firestore_doc_id = new_item['your_primary_key_column_name']['S'] 
            
            # Create a dictionary to store column values
            firestore_data = {}
            
            # Iterate through all the columns in the DynamoDB record
            for column_name, column_data in new_item.items():
                column_value = None
                # Check the data type of the column
                if 'S' in column_data:
                    column_value = column_data['S']
                elif 'N' in column_data:
                    column_value = int(column_data['N'])
                
                # Add the column value to the Firestore data dictionary
                firestore_data[column_name] = column_value
            
            # Add the data to Firestore
            firestore_collection = firestore_client.collection(FIRESTORE_COLLECTION_NAME).add(firestore_data)
