// Copyright 2018 Jerzy Głowacki

(function () {

    var maxStories = 5;
    var includedTopics = {};
    var storiesSelector = 'main > c-wiz[data-n-q] > div:first-child > div:nth-child(-n+5), main > c-wiz main > div:first-child > div:nth-child(-n+5)';
    var targetSectionSelector = 'main > c-wiz > div';
    var topicsSelector = '#library a[href^="./topics"], #library a[href^="./publications"], #searches a[href^="./search"]';
    var titleSelector = 'h2';
    var targetTitleSelector = 'main h2';
    var searchTitleSelector = 'main > c-wiz';
    var topicsUrl = location.origin + '/my/library' + location.search;
    var searchesUrl = location.origin + '/my/searches' + location.search;
    var options = {credentials: 'same-origin', cache: 'default'};
    var alreadyRemovedTopics = false;

    if (location.pathname !== '/') {
        return; // Run only on the front page
    }

    function convert(res) {
        return res.text();
    }

    function process(text) {
        new DOMParser().parseFromString(text, 'text/html').documentElement.querySelectorAll(topicsSelector).forEach(function (topic) {
            fetch(topic.href, options).then(convert).then(function (text) {
                var html = new DOMParser().parseFromString(text, 'text/html');
                // Get source title
                var titleElement = html.documentElement.querySelector(titleSelector);
                var title = titleElement ? titleElement.innerText : html.documentElement.querySelector(searchTitleSelector).dataset.nQ;
                // Clone heading
                var targetHeading = document.querySelector(targetTitleSelector).parentNode.parentNode.cloneNode(true);
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
                var stories = html.documentElement.querySelectorAll(storiesSelector.replace(/5/g, maxStories));
                stories.forEach(function (story) {
                    story.classList.add('gnf-added');
                    targetSection.appendChild(story);
                });
                removeTopics();
            });
        });
    }

    function removeTopics() {
        if (alreadyRemovedTopics) {
            return;
        }
        var newIncludedTopics = {};
        document.querySelectorAll('.' + document.querySelector(targetTitleSelector).parentNode.parentNode.className.replace(/\s+/g, '.') + ':not(.gnf-added)').forEach(function (el, i) {
            var key = el.querySelector(targetTitleSelector).innerText.trim();
            newIncludedTopics[key] = typeof includedTopics[key] === 'boolean' ? includedTopics[key] : true;
            el.classList.add('gnf-head-' + i, newIncludedTopics[key] ? 'gnf-visible' : 'gnf-hidden');
        });
        console.log('Topics:', newIncludedTopics);
        chrome.storage.sync.set({maxStories: maxStories, includedTopics: newIncludedTopics});
        alreadyRemovedTopics = true;
    }

    function init(config) {
        maxStories = config.maxStories || maxStories;
        includedTopics = Object.prototype.toString.call(config.includedTopics) === '[object Object]' && config.includedTopics || includedTopics;
        fetch(topicsUrl, options).then(convert).then(process);
        fetch(searchesUrl, options).then(convert).then(process);
        addEventListener('load', removeTopics);
    }

    chrome.storage.sync.get(['maxStories', 'includedTopics'], init);

}());