# ActionBar

Combining chatbots and searchbars

## ChatBots
### Pros:
- Have some actionable things, like `Contact the Human`, `Go to documentation` etc, but mostly they wont solve your real problem

### Cons:
- talk too much and slow
- Don't know too much about the site or the user
- Some of them don't even chat, they give you options to ask
- You can't trust their responses


## SearchBars
### Pros:
- fast response
- usually correct 
- get you directly to source
### Cons: 
- don't have any actions
- no knowledge about the user


## Introducing ActionBar
- opensource
- knows everything about your site
- can know about user (id, name, etc)
- actions
- fast
- cheap
- configurable
- can chat


### Actions
- js callbacks
- OpenAPI routes
- shows a UI for each thing that it does and its response


### Knowledge
- sitemaps - indexes all the pages daily? and stores it in a database
- files
- images
- audio and videos - should transcribe all and store as vectors
- answers - basically you input a FAQ and it answers based on those


### UI
should use something like CMD+k popup and show a list of actions. you can search those actions and also site content. If nothing is found and you press Enter it should activate chat mode where AI tries to help you. There should always be a way to toggle between the actions and the chat mode. The actions could look something like this https://vercel.com/blog/ai-sdk-3-generative-ui . 


### Alternatives
- https://commandbar.com - very similar to this idea and good implementation, but not open source, no visible demo, no self host and the cheapest plan starts at 249$/month.
- https://www.algolia.com/
- https://www.chatbot.com/
- implement own search with ElasticSearch


## Roadmap
1. <s>Example site</s>
    1. Implement basic website scraping, use OpenAI embeddings and store the data into turso db
    2. <s>Implement search functionality</s>
    3. <s>Implement basic actions with js callbacks and API calls</s>
2. External package for FE components
3. External package for BE functions
4. SST package for easy installation for every SST project 
6. More/better actions and knowledge sources
7. Get some testers/adoptation in opensource community
8. Improve the product with opensource feedback and contributions
9. Start working on the cloud hosted paid product 
    1. Logins and turso db per tenant
    2. Basic admin panel for specifying actions and knowledge sources
    3. BE side working entirely on "cloud hosting"
    4. get FE side working with easy to add `<script>` tags
    5. some small landing page
10. Try to get some test companies/websites that would like to test the cloud hosted version for free
11. Improve on the feedback
12. Implement payments and get first paying customers
13. Start adding the AI chat part
    1.  Toggle to switch between actions and chat
    2.  AI chat with data retrieval from the search
    3.  Implement actions inside chat
14. Improve the admin panel
15. Add file, image, audio and video knowledge support 
16. User based actions
17. **Make a lot of money selling the cloud hosted version lol**
