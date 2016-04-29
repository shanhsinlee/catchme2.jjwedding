# Server

## Serve html

## login

## game1

	

## game2



## game3




# Client

## login

	1. get "name", "captcha"
	
	2. check "captcha"

		success -> 3

		failed -> 4

	3. generate uid, save to redis 
		
		HMSET user:{uid} name "{name}" shake "0" hit "0" connected "false"

	4. return failed response.

## game1

	1. /user/{uid}/submit (action="hit",value="{score}")

	2. HMSET user:{uid} hit_count "{score}"

	3. return success/failed response.

## game2

	1. /user/{uid}/submit (action="shake",value="{score}")

	2. HMSET user:{uid} shake_count "{score}"

	3. return success/failed response.

## game3: (unknown)

	1. /user/{uid}/submit (action="connected",value="{boolean}")

	2. HMSET user:{uid} connected "{boolean}"

	3. return success/failed response.