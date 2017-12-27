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
export function parseGitStatus(status) {
  const files = status.split('\n');
  const statusObj = [];
  files.forEach(file => {
    if (file.length) {
      const x = file[0];
      const fileStatus = {
        status_from: GIT_STATUS[x],
        status_to: GIT_STATUS[file[1]],
        to: file.substring(3),
        from: null
      };
      if (x === 'R') {
        i++;
        fileStatus.from = files[i];
      }
      statusObj.push(fileStatus);
    }
  });

  return statusObj;
};
