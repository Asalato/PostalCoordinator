import {Address} from "./address/Address";

export class GameResult {
    public id: number;
    public stages: Stage[];

    public constructor(id: number, stages: Stage[]) {
        this.id = id;
        this.stages = stages.map(s => new Stage(s.address, s.distanceKm));
    }

    public getTotalScore(): number {
        return this.stages.reduce((t, s) => s.getScore() + t, 0);
    }
}

export class Stage {
    public address: Address;
    public distanceKm: number;

    public constructor(address: Address, distanceKm: number) {
        this.address = address;
        this.distanceKm = distanceKm;
    }

    public getScore() {
        return getScore(this.distanceKm);
    }
}

export const getScore = (distanceKm: number): number => {
    if (distanceKm > 2000) return 0;
    if (distanceKm > 500) return (2000 - distanceKm) / 1500 * 2500;
    if (distanceKm > 200) return (500 - distanceKm) / 300 * 1500 + 2500;
    return (200 - distanceKm) * 5 + 4000;
}