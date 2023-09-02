export const aboutController = {
  index(request, response) {
    const viewData = {
      title: 'About Us',
    };
    console.log('index view rendering');
    response.render('index', viewData);
  },
};
