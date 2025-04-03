import ReactGA from 'react-ga4';

export const initGA = (trackingID) => {
  ReactGA.initialize(trackingID);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};