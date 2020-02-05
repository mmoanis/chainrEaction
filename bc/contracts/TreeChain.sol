pragma solidity ^0.5.0;

contract TreeChain {

    struct Trees {
        // Plant
        address owner;
        uint256 x;
        uint256 y;
        uint256 number;

        // Verify
        uint256 score;
        bool verified;
        mapping (address => bool) verifiers_map;
        address[] verifiers_list;
    }

    struct Project {
        uint256 trees_goal;
        uint256 trees_verified;
        uint256 x;
        uint256 y;

        mapping (uint => Trees) trees;
        uint256 trees_id;
        mapping (address => uint) sponsors;
    }

    /* Globals */
    uint256 VAL_THRESHOLD = 100;
    uint256 PLANTER_SHARE = 70;
    uint256 VERIFIER_SHARE = 30;

    uint256 supply = 1000;

    /* Events */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Sponsored(address indexed _sponsor, uint256 _value);
    event Planted(address indexed _from, address indexed _project);
    event FinishProject(address indexed _project);

    /* Mappings */
    mapping (address => Project) public projects; // Map nodes to projects
    mapping (address => uint) public balances; // Map balances to nodes
    mapping (address => uint) public verifiers; // Map verifiers to reputation

    /* Methods */

    function fillBalance(address _to, uint256 _value) public returns (bool) {
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Transfer to account
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Get balance
    function getBalance(address _node) public view returns (uint256) {
        return balances[_node];
    }

    // Create a project
    function addProject(address _project, uint256 _goal, uint256 _loc_x, uint256 _loc_y) public returns (bool) {
        Project memory project;
        project.trees_goal = _goal;
        project.x = _loc_x;
        project.y = _loc_y;
        projects[_project] = project;
        return true;
    }

    // Project getters
    function getGoal(address _project) public view returns (uint256) {
        return projects[_project].trees_goal;
    }

    function getVerified(address _project) public view returns (uint256) {
        return projects[_project].trees_verified;
    }

    function getVerifier(address _verifier) public view returns (uint) {
        return verifiers[_verifier];
    }

    function getScore(address _project, uint _trees) public view returns (uint) {
        return projects[_project].trees[_trees].score;
    }

    function isVerified(address _project, uint _trees) public view returns (bool) {
        return projects[_project].trees[_trees].verified;
    }

    function getLocX(address _project) public view returns (uint256) {
        return projects[_project].x;
    }

    function getLocY(address _project) public view returns (uint256) {
        return projects[_project].y;
    }

    // Sponsor a project
    function sponsor(address _project, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value, "Not enough balance");
        balances[_project] += _value;
        projects[_project].sponsors[msg.sender] += _value;
        balances[msg.sender] -= _value;
        emit Sponsored(msg.sender, _value);
        return true;
    }

    // Plant trees
    function plant(address _project, uint256 _n_trees, uint256 _loc_x, uint256 _loc_y) public returns (bool) {
        Trees memory trees;
        trees.owner = msg.sender;
        trees.x = _loc_x;
        trees.y = _loc_y;
        trees.number = _n_trees;
        trees.verified = false;
        Project storage project = projects[_project];
        project.trees[project.trees_id] = trees;
        project.trees_id += 1;
        emit Planted(msg.sender, _project);
        return true;
    }

    // Verify plantation
    function verify(address _project, uint _trees, bool _existing) public returns (bool) {
        Trees storage tmp_trees = projects[_project].trees[_trees];
        if(!tmp_trees.verified) { //&& !tmp_trees.verifiers_map[msg.sender]
            tmp_trees.verifiers_map[msg.sender] = true;
            tmp_trees.verifiers_list.push(msg.sender);
            if(_existing) {
                tmp_trees.score += verifiers[msg.sender];
                if(tmp_trees.score >= VAL_THRESHOLD) {
                    distribute(_project, _trees);
                }
            }
            else {
                tmp_trees.score -= verifiers[msg.sender];
            }
        }
        return true;
    }

    // Evaluation of the verifictaion successful
    function distribute(address _project, uint _trees) public returns (bool) {
        Project storage project = projects[_project];
        Trees storage tmp_trees = project.trees[_trees];
        project.trees_verified += tmp_trees.number;
        balances[tmp_trees.owner] += tmp_trees.number * balances[_project] * PLANTER_SHARE / (project.trees_goal * 100);
        balances[_project] -= tmp_trees.number * balances[_project] * PLANTER_SHARE / (project.trees_goal * 100);
        for(uint i = 0; i < tmp_trees.verifiers_list.length; i++) {
            balances[tmp_trees.verifiers_list[i]] += tmp_trees.number * balances[_project] *
                VERIFIER_SHARE / (project.trees_goal * 100 * tmp_trees.verifiers_list.length);
            balances[_project] -= tmp_trees.number * balances[_project] *
                VERIFIER_SHARE / (project.trees_goal * 100 * tmp_trees.verifiers_list.length);
            verifiers[tmp_trees.verifiers_list[i]] += 3;
        }
        // Evaluation
        if(project.trees_verified >= project.trees_goal) {
            for(uint i = 0; i < project.trees_id; i++) {
                Trees storage curr_trees = project.trees[i];
                if(curr_trees.verified){
                balances[curr_trees.owner] += balances[_project] / project.trees_verified;
                balances[_project] -= balances[_project] / project.trees_verified;
                }
            }
            emit FinishProject(_project);
        }
        return true;
    }

    function setVerifier(address _verifier, uint reputation) public returns(bool){
        verifiers[_verifier] = reputation;
        return true;
    }

}