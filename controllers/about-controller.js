export const aboutController = {
  index(request, response) {
    const viewData = {
      title: 'About Us',
    };
    console.log('about rendering');
    response.render('index', viewData);
  },
};
