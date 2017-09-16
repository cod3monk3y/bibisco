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
angular.
module('bibiscoApp').
component('chapterdetail', {
  templateUrl: 'components/chapters/chapter-detail.html',
  controller: ChapterDetailController
});

function ChapterDetailController($location, $rootScope, $routeParams,
  ChapterService, LoggerService) {
  LoggerService.debug('Start ChapterDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.chapter = self.getChapter($routeParams.id);
    self.title = '#' + self.chapter.position + ' ' + self.chapter.title;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters',
      href: '/project/chapters'
    });
    self.breadcrumbitems.push({
      labelvalue: self.title
    });

    self.editmode = false;
    self.showprojectexplorer = true;

  };

  self.back = function() {
    $location.path('/project/chapters');
  }

  self.changeStatus = function(status) {
    self.chapter.status = status;
    ChapterService.update(self.chapter);
  }

  self.changeTitle = function() {
    $location.path('/chaptertitle/edit/' + self.chapter
      .$loki);
  }

  self.delete = function() {
    ChapterService.remove(self.chapter
      .$loki);
    $location.path('/project/chapters');
  }

  self.getChapter = function(id) {
    return ChapterService.getChapter(id);
  }

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.chapter
      .$loki);
  }

  LoggerService.debug('End ChapterDetailController...');
}