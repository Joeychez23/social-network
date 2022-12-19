# Social Network

## Table of Contents:

[1. Description](#Description)  
[2. Installation](#Installation)  
[3. Usage](#Usage)  
[4. Output](#Output)  
[5. Contributors](#Contributors)  
[6. Questions](#Questions)

## Description

Using MongoDB, this program can generate user date from a seed, then the user can make api calls using insomnia to see the data and manipulate values as they see fit


### User API Examples

Get All User Example: [GET] http://localhost:3000/api/users/

Get Single User Example: [GET] http://localhost:3000/api/users/[_id]

Create User: [POST] http://localhost:3000/api/users/


[POST] json: {

	"username": "test100,

	"email":  "test100@test.com",

	"friends": [

		"[_id]",

		"[_id]"

	]
}

Update User: [PUT] http://localhost:3000/api/users/[_id]

[PUT] json: {

	"username": "test",

	"email":  "test@test.com"
}

Delete User: [DELETE] http://localhost:3000/api/users/[_id]


### Thought API Examples

Get All Thought Example: [GET] http://localhost:3000/api/thoughts/

Get Single Thought Example: [GET] http://localhost:3000/api/thoughts/[_id]

Create Thought: [POST] http://localhost:3000/api/thoughts/


[POST] json: {

  "thoughtText": "Here's a cool thought...",

  "createdBy": "639fbf49ed623ffe1b35e0db"
}

Update Thought: [PUT] http://localhost:3000/api/thoughts/[_id]

[PUT] json: {

  "thoughtText": "Here's a cool thought",

  "createdBy": "639fbe6aeae156c80c59189c"
}

Delete Thought: [DELETE] http://localhost:3000/api/thoughts/[_id]



### Friend API Examples

NOTE! First _id is the user, the second _id is the user that will be added or removed first users list

Added Friend: [POST] http://localhost:3000/api/users/[_id]/friends/[_id]
Delete Friend: [DELETE] http://localhost:3000/api/users/[_id]/friends/[_id]



### Reaction API Examples 

NOTE! The First _id is the thought _id and the second if required is the reaction _id

Add Reaction: [POST] http://localhost:3000/api/thoughts/[_id]/reactions/

Delete Reaction: [DELETE]http://localhost:3000/api/thoughts/[_id]/reactions/[_id]



## Installation

1. clone the repo
2. cd into the directory
3. run npm i inside the terminal

## Usage

1. run "npm start"

## Output

Repo: https://github.com/Joeychez23/social-network

Video: https://drive.google.com/file/d/1CdARz0dWpi3y6IGFS1Ik_hPipgq4iej_/view


## Contributors

Joeychez23

## Questions

Email: joeychez123@gmail.com

Github: https://github.com/Joeychez23

Repo: https://github.com/Joeychez23/social-network

Video: https://drive.google.com/file/d/1CdARz0dWpi3y6IGFS1Ik_hPipgq4iej_/view