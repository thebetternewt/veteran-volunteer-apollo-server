export default {
  ChildcareService: {
    age: parent => {
      // Format array of values from GraphQL
      return parent.age.join().split(',')
    },
  },
}
