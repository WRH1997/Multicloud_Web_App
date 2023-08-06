# CI/CD Process for SDP 10 Trivia Titans Frontend:


1.	Clone the CS GitLab repository to your local machine - https://git.cs.dal.ca/vasa/csci5410-sdp-10.git
2.	Merge “main” branch to your personal development branch. You will now get the basic folder structure for the React frontend for Trivia Titans
3.	Make required changes to the code
4.	Commit and Push the code to the CS GitLab repository. Since Repo Mirroring is enabled, all changes in all Branches will be automatically reflected to the Public GitHub repository - https://github.com/rishivasa33/Project-Frontend--Serverless-Data-Processing-Group-10 where all team members have been added as collaborators
5.	Now to enable CI/CD for the first time, go to Google Cloud Run and select “Create Service” 
6.	Select “Continuously deploy new revisions from a source repository”
7.	Click on “Set up with Cloud Build”
8.	Enter Repository Provider – “GitHub”. Authenticate by logging in and granting Permissions to Cloud Build
9.	Select Repository - “rishivasa33/Project-Frontend--Serverless-Data-Processing-Group-10”
10.	Click “Next”
11.	In Build Configuration, select your development Branch like “^develop-adithya$”
12.	Select Build Type as “Dockerfile”
13.	Enter Source Location as “/trivia-titans-frontend/Dockerfile”
14.	Click “Save”
15.	Enter Service Name as something like “trivia-titans-sdp10-adithya”
16.	Select Region “us-central1”
17.	Select “CPU is only allocated during request processing”
18.	Select “All” Allow direct access to your service from the internet
19.	Select ”Allow Unauthenticated invocations”
20.	IMPORTANT: Expand Container, Networking and Security and select Memory Capacity as “1GB” and Request Timeout as “3600” seconds
21.	Select “Create”. After a few minutes, app will be running on the URL at the top like https://trivia-titans-sdp10-ppid7diiyq-uc.a.run.app/ for example. It may try to start the development server multiple times before running. Logs will be visible in the Logs tab
22.	This will pull the code from the public GitHub repo and from your branch, run the build using Cloud Build, Push the built Docker image to Artifact Registry, and then run the container on Cloud Run
23.	After this “pipeline” is created, The next time all you have to do is commit your code to the GitLab branch, and the entire integration and deployment process will be done automatically

Author: Rishi Vasa.