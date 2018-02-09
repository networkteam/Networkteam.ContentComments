import manifest from '@neos-project/neos-ui-extensibility';

import ContentCommentEditor from './ContentCommentEditor';

manifest('Neos.Neos.UI.NetworkteamContentComments:CommentEditor', {},
    globalRegistry => {
        const editorsRegistry = globalRegistry.get('inspector').get('editors');

        editorsRegistry.set('Neos.Neos.UI.NetworkteamContentComments:CommentEditor', {
            component: ContentCommentEditor,
            hasOwnLabel: false
        })
});
