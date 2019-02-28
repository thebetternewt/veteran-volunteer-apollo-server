export default {
  ChildcareService: {
    age: parent => {
      // Format array of values from GraphQL
      console.log(parent.age)
      return parent.age.join().split(',')
    },
  },
}
