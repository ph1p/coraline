const GIT_STATUS = {
  ' ': 'unmodified',
  '?': 'untracked',
  '!': 'ignored',
  M: 'modified',
  A: 'added',
  D: 'deleted',
  R: 'renamed',
  C: 'copied',
  U: 'umerged'
};

/**
 * Parse git status string
 * @param {string} status
 */
exports.parseGitStatus = status => {
  const files = status.split('\n');
  const statusObj = [];

  files.forEach(file => {
    if (file.length) {
      const [fl, sl] = file;
      const fileStatus = {
        statusTo: fl === ' ' ? GIT_STATUS[sl] : GIT_STATUS[fl],
        added: fl !== ' ',
        to: file.substring(3),
        from: null
      };

      if (fl === 'R' || sl === 'R') {
        const [from, to] = file.substring(3).split(' -> ');

        fileStatus.added = true;
        fileStatus.from = from;
        fileStatus.to = to;
      }
      statusObj.push(fileStatus);
    }
  });

  return statusObj;
};
