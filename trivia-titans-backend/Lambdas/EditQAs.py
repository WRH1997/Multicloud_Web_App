import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def validateUser(slots, data):
  for item in data:
    if item['userEmail'] == slots['Email']['value']['originalValue']:
      return{
        "isValid": True
      }
  return{
    "isValid": False,
    "invalidSlot": "Email",
    "message": "The email you entered does not exist in our system. Please try again!"
  }
  


def lambda_handler(event, context):
  
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('userLoginInfo')
  response = table.scan()
  data = response['Items']

  bot = event['bot']['name']
  slots = event['sessionState']['intent']['slots']
  intent = event['sessionState']['intent']['name']
  
  if event['invocationSource'] == 'FulfillmentCodeHook':
    table.update_item(
      Key={
        'userEmail': slots["Email"]["value"]["originalValue"]
      },
      UpdateExpression="set secretQuestion1 = :secretQuestion1, secretQuestion2 = :secretQuestion2, secretQuestion3 = :secretQuestion3, secretAnswer1 = :secretAnswer1, secretAnswer2 = :secretAnswer2, secretAnswer3 = :secretAnswer3",
      ExpressionAttributeValues={
        ":secretQuestion1": slots["SQ1"]["value"]["originalValue"],
        ":secretQuestion2": slots["SQ2"]["value"]["originalValue"],
        ":secretQuestion3": slots["SQ3"]["value"]["originalValue"],
        ":secretAnswer1": slots["SA1"]["value"]["originalValue"],
        ":secretAnswer2": slots["SA2"]["value"]["originalValue"],
        ":secretAnswer3": slots["SA3"]["value"]["originalValue"],
      }
      )
    response = {
      "sessionState": {
        "dialogAction": {
          "type": "Close"
        },
        "intent": {
          "name": intent,
          "slots": slots,
          "state": "Fulfilled"
        },
        "messages": [{
          "contentType": "PlainText",
          "content": "Thanks"
        }]
      }
    }
    return response
  
  userValidationRes = validateUser(slots, data)
  if not userValidationRes['isValid']:
    response = {
        "sessionState": {
          "dialogAction": {
            "slotToElicit": userValidationRes['invalidSlot'],
            "type": "ElicitSlot"
          },
          "intent": {
            "name": intent,
            "slots": slots
          }
        },
        "messages": [{
          "contentType": "PlainText",
          "content": userValidationRes['message']
        }]
      }
    return response
  else:
    response = {
      "sessionState": {
        "dialogAction": {
          "type": "Delegate"
        },
        "intent": {
          "name": intent,
          "slots": slots
        }
      }
    }
    return response
      

