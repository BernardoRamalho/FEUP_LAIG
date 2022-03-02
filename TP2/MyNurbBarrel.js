/**
 * MyNurbBarrel
 */
class MyNurbBarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        // Variables used to create the points of the surfaces
        let H = (4 * (middle - base)) / 3;
        let h = (4 * base) / 3;
        let middleH = 6/5 * (h + H); // Value that gives the roudest barrel
    
            // Create Top Surface

        // Points used for the top surface
        let topPoints = this.createTopControlPoints(H, h, middleH, height, base);

        // Create Top Nurb Surface
        this.topSurface = new CGFnurbsSurface(3, 3, topPoints);

        // Create Top Nurb Oject using the surface created
        this.topObject = new CGFnurbsObject(scene, slices, stacks, this.topSurface);

            // Create Bottom Surface

        // Points used for the bottom surface
        let bottomPoints = this.createBottomControlPoints(H, h, middleH, height, base);

        // Create Bottom Nurb Surface
        this.bottomSurface = new CGFnurbsSurface(3, 3, bottomPoints);

        // Create Bottom Nurb Oject using the surface created
        this.bottomObject = new CGFnurbsObject(scene, slices, stacks, this.bottomSurface);

    }
    
    display(){
        this.topObject.display();
        this.bottomObject.display();
    }

    /**
     * Function that creates the control points of top surface of the barrel
     */
    createTopControlPoints(H, h, middleH, height, base){
        // Points used for the top surface
        let topPoints = [ 
            [ // U = 3
                [base, 0, 0, 1],
                [(base + H), 0, height / 3, 1],
                [(base + H), 0, 2 * height / 3, 1],
                [base, 0, height, 1]
            ],
            [ // U = 2
                [base, h, 0, 1],
                [(base + H),middleH, height / 3, 1],
                [(base + H), middleH, 2 * height / 3, 1],
                [base, h, height, 1]
            ],
            [ // U = 1
                [-base, h, 0, 1],
                [-(base + H), middleH, height / 3, 1],
                [-(base + H), middleH,  2 * height / 3, 1],
                [-base, h, height, 1]
            ],
            
            [ // U = 0
                [-base, 0, 0, 1],
                [-(base + H), 0,height / 3, 1],
                [-(base + H), 0, 2 * height / 3, 1],
                [-base, 0, height, 1]
            ]
            
        ];

        return topPoints
    }

    /**
     * Function that creates the control points of bottom surface of the barrel
     */
    createBottomControlPoints(H, h, middleH, height, base){
        let bottomPoints = [ 
            [ // U = 0
                [-base, 0, 0, 1],
                [-(base + H), 0,height / 3, 1],
                [-(base + H), 0, 2 * height / 3, 1],
                [-base, 0, height, 1]
            ],
            [ // U = 1
                [-base, -h, 0, 1],
                [-(base + H), -middleH, height / 3, 1],
                [-(base + H), -middleH,  2 * height / 3, 1],
                [-base, -h, height, 1]
            ],
            [ // U = 2
                [base, -h, 0, 1],
                [(base + H),-middleH, height / 3, 1],
                [(base + H), -middleH, 2 * height / 3, 1],
                [base, -h, height, 1]
            ],
            [ // U = 3
                [base, 0, 0, 1],
                [(base + H), 0, height / 3, 1],
                [(base + H), 0, 2 * height / 3, 1],
                [base, 0, height, 1]
            ]
        ];

        return bottomPoints;
    }

}