# Fixer for Google News

This Chrome extension fixes the inability to customize the new Google News front page by adding your favorite topics, locations, sources and saved searches to the main news feed, as well as removing unnecessary topics from it, like: Headlines, For you, U.S., World, Business, Technology, Entertainment, Sports, Science or Health. You can choose what to hide in the extension options.

## How it works

After opening the front page of [news.google.com](https://news.google.com/), Fixer for Google News asynchronously fetches favorite topics, locations, sources and saved searches in the background. Then it appends them to the main news feed as sections with clickable titles. The extension also hides standard sections specified in the options and stored in `chrome.storage`. This is not as trivial as it sounds, due to Google News being an obfuscated and highly dynamic web app.

## Notice

This extension is in beta stage, it is provided "as is" and it is not affiliated with Google.

Google News is a trademark of Google.

Icon made by Oxy Nation.

## License

© 2018 Jerzy Głowacki under GNU GPL 3 License.