const dataServers = {
  pod: {
    pod: true,
    default: true,
    authServer: true,
    baseUrl: null, // Calculated from the token
    sparqlEndpoint: null,
    containers: {
      pod: {
        "as:Note": ["/notes"],
        "vcard:Location": ["/locations"],
        "vcard:Individual": ["/profiles"],
        "vcard:Group": ["/groups"],
      },
    },
    uploadsContainer: "/files",
  },
};

export default dataServers;
