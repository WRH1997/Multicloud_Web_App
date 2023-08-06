import boto3

def lambda_handler(event, context):
    # Get the userId from the event
    userId = event['uid']
    
    # Create a DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    # Get the UserStatistics table
    table = dynamodb.Table('User')
    
    # Fetch user statistics from DynamoDB
    response = table.get_item(Key={'uid': userId})
    win = 0
    
    # Process the response and extract relevant statistics
    if 'Item' in response:
        item = response['Item']
        games_played = item.get('games_played', 0)
        win = item.get('win', 0)
        total_points_earned = item.get('total_points_earned', 0)
    else:
        games_played = 0
        win_loss_ratio = 0
        total_points_earned = 0
    
    loss = (games_played - win)
    win_loss_ratio = win/(games_played - win)
    
    # Prepare the response
    response = {
        'gamesPlayed': games_played,
        'win': win,
        'loss': loss,
        'winLossRatio': win_loss_ratio,
        'totalPointsEarned': total_points_earned
    }
    
    # Return the response
    return response
