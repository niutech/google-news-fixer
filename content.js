// Copyright 2018 Jerzy Głowacki

(function () {

    var maxStories = 5;
    var includedTopics = [true, true, true, true, true, true, true, true, true, true];
    var storiesSelector = 'main > c-wiz > div:first-child > div:nth-child(-n+5)';
    var targetSectionSelector = 'main > c-wiz > div';
    var topicsSelector = '#library a[href^="./topics"], #library a[href^="./publications"], #searches a[href^="./search"]';
    var titleSelector = 'h2';
    var searchTitleSelector = 'main > c-wiz';
    var topicsUrl = '/my/library' + location.search;
    var searchesUrl = '/my/searches' + location.search;
    var options = {credentials: 'same-origin', cache: 'default'};

    if (location.pathname !== '/') {
        return; // Run only on the front page
    }

    function convert(res) {
        return res.text();
    }

    function process(text) {
        var html = new DOMParser().parseFromString(text, 'text/html');
        var topics = html.documentElement.querySelectorAll(topicsSelector);
        topics.forEach(function (topic) {
            fetch(topic.href, options).then(convert).then(function (text) {
                var html = new DOMParser().parseFromString(text, 'text/html');
                // Get source title
                var titleElement = html.documentElement.querySelector(titleSelector);
                var title = titleElement ? titleElement.innerText : html.documentElement.querySelector(searchTitleSelector).dataset.nQ;
                // Clone heading
                var targetHeading = document.querySelector('h3').parentNode.parentNode.cloneNode(true);
                targetHeading.classList.remove('gnf-head-0', 'gnf-visible', 'gnf-hidden');
                targetHeading.classList.add('gnf-added');
                // Prepare title
                var targetTitleLinks = targetHeading.querySelectorAll('a');
                var oldTitle = targetTitleLinks[0].innerText;
                targetTitleLinks[0].innerText = title;
                targetTitleLinks[1].innerText = targetTitleLinks[1].innerText.replace(oldTitle, title);
                targetTitleLinks[1].href = targetTitleLinks[0].href = topic.href;
                // Insert title
                var targetSection = document.querySelector(targetSectionSelector);
                targetSection.appendChild(targetHeading);
                // Insert stories
                var stories = html.documentElement.querySelectorAll(storiesSelector.replace('5', maxStories));
                stories.forEach(function (story) {
                    story.classList.add('gnf-added');
                    targetSection.appendChild(story);
                });
                // Remove excluded topics
                var targetHeadings = document.querySelectorAll('.' + document.querySelector('h3').parentNode.parentNode.className.replace(/\s+/g, '.') + ':not([class*="gnf-head-"])');
                for (var i = 0; i < targetHeadings.length && i < includedTopics.length; i++) {
                    targetHeadings[i].classList.add('gnf-head-' + i, includedTopics[i] ? 'gnf-visible' : 'gnf-hidden');
                }
            });
        });
    }

    function init(config) {
        maxStories = config.maxStories || maxStories;
        includedTopics = config.includedTopics || includedTopics;
        fetch(topicsUrl, options).then(convert).then(process);
        fetch(searchesUrl, options).then(convert).then(process);
    }

    chrome.storage.sync.get(['maxStories', 'includedTopics'], init);

}());