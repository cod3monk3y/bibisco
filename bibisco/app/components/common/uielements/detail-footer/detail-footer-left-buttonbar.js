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
component('detailfooterleftbuttonbar', {
  templateUrl: 'components/common/uielements/detail-footer/detail-footer-left-buttonbar.html',
  controller: DetailFooterLeftButtonbarController,
  bindings: {
    editmode: '<',
    imagesenabled: '<',
    showimagesfunction: '&',
    showprojectexplorer: '=',
    revisionactive: '<',
    revisioncount: '<',
    revisionenabled: '<',
    revisionfunction: '&',
    tagsenabled: '<',
    tagsfunction: '&',
    words: '<'
  }
});

function DetailFooterLeftButtonbarController($location, $translate,
  LoggerService, PopupBoxesService) {

  LoggerService.debug('Start DetailFooterLeftButtonbarController...');
  console.log('Start DetailFooterLeftButtonbarController...');

  var self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'revision_label',
      'revision_label_create_new_revision',
      'revision_label_delete_revision',
      'revision_confirm_new_revision_from_actual',
      'revision_confirm_delete_revision'
    ]);;

    // populate revisions
    self.revisions = [];
    self.revisionactual;
    self.revisionselected;

    for (let i = self.revisioncount; i > 0; i--) {
      let revision = self.createRevisionItem(i);
      self.revisions.push(revision);

      if (self.revisionactive == i) {
        self.revisionactual = revision;
        self.revisionselected = revision;
      }
    }

    // add new revision command
    self.revisions.push({
      key: 'new',
      description: self.translations.revision_label_create_new_revision
    });

    // add delete revision command
    if (self.revisioncount > 1) {
      self.addDeleteRevisionCommand();
    }
  }

  self.toggleProjectExplorer = function() {
    self.showprojectexplorer = !self.showprojectexplorer;
  }

  self.selectRevision = function() {
    if (self.revisionselected.key == 'new') {
      PopupBoxesService.confirm(self.createRevisionFromActual,
        self.translations.revision_confirm_new_revision_from_actual,
        self.createRevisionFromScratch);
    } else if (self.revisionselected.key == 'delete') {
      PopupBoxesService.confirm(self.deleteRevision,
        self.translations.revision_confirm_delete_revision,
        self.restoreRevisionActual);
    } else {
      self.changeRevision();
    }
  }

  self.addDeleteRevisionCommand = function() {
    self.revisions.push({
      key: 'delete',
      description: self.translations.revision_label_delete_revision
    });
  }

  self.removeDeleteRevisionCommand = function() {
    self.revisions.pop();
  }

  self.deleteRevision = function() {

    self.revisionfunction({
      'key': 'delete'
    });

    let revisionToDelete = parseInt(self.revisionselected.key);

    for (let i = 0; i < self.revisioncount; i++) {
      let revisionitem = parseInt(self.revisions[i].key);
      if (revisionitem > revisionToDelete) {
        self.revisions[i].key = self.revisions[i].key - 1;
      }
    }
    self.revisions.splice(revisionToDelete - 1, 1);
    self.revisioncount--;
    self.revisionselected = self.revisions[0];
    self.revisionactual = self.revisions[0];

    if (self.revisioncount == 1) {
      self.removeDeleteRevisionCommand();
    }
  }

  self.addRevision = function() {
    self.revisioncount++;

    let newrevision = self.createRevisionItem(self.revisioncount);
    self.revisions.unshift(newrevision);
    self.revisionselected = newrevision;
    self.revisionactual = newrevision;

    if (self.revisioncount == 2) {
      self.addDeleteRevisionCommand();
    }
  }

  self.createRevisionItem = function(revisionNumber) {
    return {
      key: '' + revisionNumber,
      description: self.translations.revision_label + ' ' + revisionNumber
    }
  }

  self.changeRevision = function() {
    self.revisionfunction({
      'key': self.revisionselected.key
    });
    self.revisionactual = self.revisionselected;
  }

  self.createRevisionFromActual = function() {
    self.revisionfunction({
      'key': 'new-from-actual'
    });
    self.addRevision();
  }

  self.createRevisionFromScratch = function() {
    self.revisionfunction({
      'key': 'new-from-scratch'
    });
    self.addRevision();
  }

  self.restoreRevisionActual = function() {
    self.revisionselected = self.revisionactual;
  }

  LoggerService.debug('End DetailFooterLeftButtonbarController...');
}
