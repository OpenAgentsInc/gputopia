# Job flow (v3)

- Buyer sends chat message in UI
  - POST request to `/api/chat`
    - Assigns a random job ID
    - _Creates a Job in the database_
    - Sends Pusher event with job details to private-v3jobs channel
- Seller with loaded model listens for jobs. When received, call `processJob`:
  - POST request to `/api/lock-job` with job ID
  - Tries to lock job (check via Redis if anyone else has)
  - If successful, complete the inference
- Seller completes inference
  - Seller streams the result to the buy via Pusher [client event](https://pusher.com/docs/channels/using_channels/events/#triggering-client-events)
  - POST request to `/api/complete` with result
    - _Verify this user is who locked this job_
    - _Update Job in database with result_
    - Award job reward to seller
    - Award availability reward to all other sellers
      - Grab a list of userIds in the channel
      - _Ensure under the max of 25 sats per minute_
      - Update their balance by 1
