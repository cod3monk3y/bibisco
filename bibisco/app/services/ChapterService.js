/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('ChapterService', function(
  LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapters');
  var dynamicView = collection.addDynamicView(
    'all_chapters').applySimpleSort('position');

  return {
    getChapter: function(id) {
      return collection.get(id);
    },
    getChaptersCount: function() {
      return collection.count();
    },
    getChapters: function() {
      return dynamicView.data();
    },
    insert: function(chapter) {
      collection.insert(chapter);
      ProjectDbConnectionService.saveDatabase();
    },
    move: function(sourceId, targetId) {
      let sourceChapter = this.getChapter(sourceId);
      let sourceChapterPosition = sourceChapter.position;
      let targetChapter = this.getChapter(targetId);
      let targetChapterPosition = targetChapter.position;

      if (sourceChapterPosition < targetChapterPosition) {
        let chaptersToShift = collection.find({
          position: {
            '$between': [sourceChapterPosition + 1,
              targetChapterPosition
            ]
          }
        });
        for (let i = 0; i < chaptersToShift.length; i++) {
          chaptersToShift[i].position = chaptersToShift[i].position - 1;
        }
      }
      sourceChapter.position = targetChapterPosition;
      collection.update(sourceChapter);
      ProjectDbConnectionService.saveDatabase();

      return this.getChapters();
    }
  }
});