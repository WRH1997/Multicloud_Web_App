import boto3
import traceback

# Constants
TABLE_NAME = 'User'
TOP_N = 20

def lambda_handler(event, context):
    top_users = []
    try:
        # Retrieve the filter from the input JSON
        filter_key = event['filter']

        # Create a DynamoDB client
        dynamodb = boto3.client('dynamodb')

        # Perform a scan on the DynamoDB table to get all users
        response = dynamodb.scan(
            TableName=TABLE_NAME,
            ProjectionExpression="displayName, games_played, total_points_earned, win"
        )

        # Extract the user data from the DynamoDB response
        all_users = []
        for item in response['Items']:
            user = {
                'name': item['displayName']['S'],
                'games_played': float(item['games_played']['N']),
                'total_points_earned': float(item['total_points_earned']['N']),
                'win': float(item['win']['N'])
            }
            if user['games_played'] > 0:  # Filter out items where games_played is 0
                all_users.append(user)

        # Sort the users based on the filter_key (e.g., 'games_played')
        sorted_users = sorted(all_users, key=lambda x: x[filter_key], reverse=True)

        # Get the top 20 users
        top_users = sorted_users[:TOP_N]
        print(top_users)

        return {
            'top_users': top_users
        }
    except Exception as e:
        traceback.print_exc()
        return {
            'top_users': top_users
        }