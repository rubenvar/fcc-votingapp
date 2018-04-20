import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import ajaxVote from './modules/vote';
import { ajaxDelete, ajaxConfirmDelete, ajaxCancelDelete } from './modules/delete';

const voteForms = $$('form.vote');
voteForms.on('submit', ajaxVote);

const deleteConfButtons = $$('button.delete-first');
deleteConfButtons.on('click', ajaxConfirmDelete);

const deleteButtons = $$('form.delete');
deleteButtons.on('submit', ajaxDelete);

const cancelDeleteButtons = $$('button.delete-cancel');
cancelDeleteButtons.on('click', ajaxCancelDelete);