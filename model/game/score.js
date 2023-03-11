export class Score {
    constructor(){
        this.points = 0;
    }

    update(lines, level) {

        switch(lines){
            case 1:
                this.points += 40 * (level+1);
                break;
            case 2:
                this.points += 100 * (level+1);
                break;
            case 3:
                this.points += 300 * (level+1);
                break;
            case 4:
                this.points += 1200 * (level+1);
                break;
            default:
                break;
        }
    }

}