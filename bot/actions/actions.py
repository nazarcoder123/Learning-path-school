from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
# from rasa_sdk.events import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk import Action

class ActionSayData(Action):

    def name(self) -> Text:
        return "action_say_data"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        name = tracker.get_slot("name")
        email = tracker.get_slot("email")
        phone = tracker.get_slot("phone")
        print("ph is:",phone)


        dispatcher.utter_message(text=f"Hey {name}, your email is:{email},& your phone number is:{phone}.thanks you for filling the form we will get back to you soon.")
        
        return []
    
