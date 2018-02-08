const localesReg = new RegExp('/en/|/zh/');
const apiReg = new RegExp('/api/');

export function getpruepath(pathname) {
  let pruepath = pathname.replace(/\/$/, '');
  pruepath = pruepath.replace(/.*?(\.html)$/, '');
  return pruepath;
}

export function getlocalname(pruepath) {
  let localname = 'zh';

  if (localesReg.test(pruepath)) {
    localname = pruepath.split('/')[1];
  }

  return localname;
}

export function removelocal(pathname) {
  const pruepath = getpruepath(pathname);

  if (localesReg.test(pruepath)) {
    const localname = getlocalname(pruepath);
    const localnameReg = new RegExp(`/${localname}`);

    return pruepath.replace(localnameReg, '');
  } else {
    return pruepath;
  }
}

export function removelocalkeepmain(pathname) {
  let pruepath = removelocal(pathname);

  if (!/^\//.test(pruepath)) {
    pruepath = `/${pruepath}`;
  }

  const keeppath = pruepath.replace(/(\/.*?)\/.*/, '$1');

  return keeppath;
}

export function removelocalkeepsub(pathname) {
  const pruepath = removelocal(pathname);
  const keeppath = pruepath.replace(/(\/.*?\/.*?)\/.*/, '$1');

  return keeppath;
}

export function removelocalkeepthree(pathname) {
  const pruepath = removelocal(pathname);
  const keeppath = pruepath.replace(/(\/.*?\/.*?\/.*?)\/.*/, '$1');

  return keeppath;
}

export function historyreplace(history, pruepath, search) {
  console.log(pruepath);
  if (!localesReg.test(pruepath)) {
    if (pruepath === '' || pruepath === '/') {
      history.replace('/zh/index');
    } else {
      history.replace(`/zh${pruepath}${search}`);
    }
  }
}

export function localMiddle(req, res, next) {
  const pruepath = getpruepath(req._parsedUrl.pathname);

  if (apiReg.test(pruepath)) {
    next();
  } else if (localesReg.test(pruepath)) {
    next();
  } else if (pruepath === '') {
    res.redirect('/zh/index');
  } else {
    res.redirect(`/zh${pruepath}`);
  }
}

export function pathSarchValue(pathsearch, key) {
  let searchValue = '';

  const searchArray = pathsearch && pathsearch.substring(1) && pathsearch.substring(1).split('&');

  if (searchArray) {
    for (let i = 0; i < searchArray.length; i++) {
      const item = searchArray[i];
      const itemArray = item.split('=');
      if (itemArray.length > 1 && itemArray[0] === key) {
        searchValue = itemArray[1];
      }
    }
  }

  return searchValue;
}

export function getFromMenu(pathsearch, key) {
  return removelocal(pathSarchValue(pathsearch, key)).replace(/\//g, '');
}

export function getPathEnd(pathname) {
  const nameArr = pathname.split('/');
  return nameArr[nameArr.length - 1];
}
