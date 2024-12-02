import { useMemo } from 'react';
import renderMentions from './renderMentions';

/**
 *
 * @param data The list of mentionable actors to be used in the mention suggestions.
 *  e.g. : {
 *    id: 'https://pod.provider/username', => the value that will be used in the "data-id" attribute of the generated link in the document
 *    label: '@username@pod.provider' => will be displayed in the document and stored in the "data-label" of the link
 *  }
 * @returns {{items: (function({query: *}): *), render: ((function(): {onKeyDown(*): (boolean|*), onStart: function(*): void, onExit(): void, onUpdate(*): void})|*)}}
 */
const useMentions = data => {
  /**
   * Filters suggestions using the end user query (what is typed after a "@" in the text field)
   * @type {function({query: *}): *}
   */
  const items = useMemo(
    () => ({ query }) => data.filter(({ label }) => label.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    , [data]
  );

  return {
    items,
    render: renderMentions
  };
};

export default useMentions;
