# Calendar_Planner
This is my personal project I've been working on for the past 2 months. Throughout its development I've experienced many new methods and technologies via encountering problems and solving them.
Preview:
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/29e5b2e9-d2ae-46e6-8226-3d14bd4c34e0)
> To see the image clearly, click on it to display it in fullscreen

## What can you find in this project?
1. Manipulation of plans
2. Search algorithm
3. Different displays of the Calendar
4. Login
5. APIs

## 1. Manipulation of plans
### Plan Creation
User can create a plan by giving it a title (required), date, hour, colour and its description.
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/d27add6b-43c9-400a-ad19-f7e3b6ce1c0a)
### Plan details and choice to cancel the plan
By clicking on the plan, the user can display its details, the user can also fluently switch between plans.
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/37c2702e-2e08-444d-87de-c53e43d51119)
### Plans cannot overlap
If the user tries to create a plan which would overlap with an existing one, the Calendar will throw an error.
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/ac57a69b-927f-4e74-8694-76f81eabb436)

## 2. Search algorithm
If the user types in first 3 letters of any word present either in the title or description of any plan, the algorithm will find it.
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/2216c804-dff4-4542-8b60-74e336371440)
These are the results: 
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/8b60aa6e-9afb-405e-a2a6-fb2d2545a852)
By clicking on the "display" button, the Calendar will instantly jump to the plan's location and show it to the user:
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/c28d6a1d-09eb-45bd-b7e2-02b90fbb7564)

## 3. Different displays of the Calendar
Default display is Week (as shown above)
### Month display
Month counts the number of plans in a given day and displays it. 
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/813f93a6-f24e-490b-b042-188572540bdb)
### Year display
So far, year only shows the whole year to the user.
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/331954d4-0f9c-46f6-9231-54f42e2c4ed6)

## 4. Login
If the user chooses to, they can login, though since all data is stored locally usin JSON, it is not necessary.
By clicking on the login symbol pops up this form:
![image](https://github.com/IkigaiFumeidesu/Calendar_Planner/assets/150911217/62707778-bff6-4aa2-8416-4878808316e9)
Upon successfully logging in, the user's name is stored as a cookie and it is used to validate that user is logged in, password is not stored.

## 5. APIs
Currently, Calendar runs 2 APIs. 
First API is used to get the CountryCode of the user. For this it is using this API: (https://ipinfo.io/)
Second API is used to get the public holidays of a country based on the submitted year and CountryCode. This API runs AFTER the first one finished retrieving CountryCode. API: (https://date.nager.at/)








