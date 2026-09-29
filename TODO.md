# Some features we can implement

## Find out if we can attach event listeners to css animations, and use those if possible
Currently, we hardcode the "congratulations" message to popup around 1 seconds after a user guesses a word correctly because 1 second is roughly how long it takes for the css animations of the letters flippiing.

## Save the user's wordle progress for the day
Currently, if a user guesses a word correctly, and then refreshes the page, the game resets, but we can probably use localStorage to rectify this. Just need to figure out how to reset the game the next day a user tries to play the new wordle.

## Implement a timed feature so that we can implement some kind of daily leaderboard
This might be challenging because we don't have any auth in this, and we shouldn't require it; we would instead just ask the user to ask for what they want their display name to be for today. Another challenge is how do you rank players? We would have to take into account # of tries, time taken to solve, and perhaps # of invalid words guessed. Also possibly players who guessed incorrectly maybe don't even get on the leader. One last consideration is that there is no check for cheating, although this might be possible through hashing user's IP address (this might require some privacy notice).

## Implement some simple UI to show the user that the copy paste worked, after they click the "Create Link" button on the create your custom wordle page.
This could be some simple toast that shows a check mark.

## We need some error handling UI on the frontend
One possible error is when there is no wordle of the day in the db. There should also be some error handling for all other errors.
