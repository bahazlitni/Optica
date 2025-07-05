function removeI(i){
   for(let j=i; j<this.matrix.length; j++)
   this.matrix[j] = this.matrix[j+1]


   this.matrix.pop()
}

const obj = {matrix: [0,1,2,3,4,5,6]}
removeI.call(obj, 2)
console.log(obj)
