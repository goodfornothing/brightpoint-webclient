function SectionAdapter(){
    var data = {};

    this.getData = function(){
        return data;
    }
    this.setData = function(s){
        data = s;
    }
}