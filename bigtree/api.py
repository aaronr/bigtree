from flask import abort, request, render_template, jsonify
import psycopg2
import sys
import os
import re
import json
from utils.jsonp import jsonp
import random

def api_landing():
    return redirect(url_for('bigtree'))

def build_tree(cursor,root, depth):
    if depth == 1:
        sql = "select * from toc1 where path ~ '%s.*{1}'" % (root)                    
        cursor.execute(sql)
        results = cursor.fetchall()
        btresponse = []
        for i,row in enumerate(results):
            children = []
            if re.match(r".*\.D\d+$",row[1]):
                # We have a directory so put a placeholder in for children
                # so the UI will know to make it a folder... even though there are 
                # no populated children yet
                fakepath = row[1]+".D0"
                children.append({'label':'placeholder','id':random.randint(9999,999999),'path':fakepath,'children':[]})
            btresponse.append({'label':row[2],'id':row[0],'path':row[1],'children':children})
        return btresponse
    else:
        # find the roots children
        # loop through and build the sub-trees
        sql = "select * from toc1 where path ~ '%s.*{1}'" % (root)                    
        cursor.execute(sql)
        results = cursor.fetchall()
        btresponse = []
        for i,row in enumerate(results):
            btresponse.append({'label':row[2],'id':row[0],'path':row[1],'children': build_tree(cursor,row[1],depth-1)})
        return btresponse

@jsonp
def bigtree():
    if request.method == 'GET':
        connstring="dbname='bigtree' port=5432 user='aaronr' host='localhost' password='aaronr'"
        try:
            conn=psycopg2.connect(connstring)
            cursor=conn.cursor()
            #return jsonify({'response':'connection success'})
        except Exception, e:            
            abort(404)

        if 'root' in request.args:
            # Root is required
            root = request.args['root']

            depth = 1
            # depth >= 1 -> Output for 'depth' level of 'root' directory
            # default depth == 1
            if 'depth' in request.args:
                depth = int(request.args['depth'])
                if depth <= 0:
                    abort(404)

            q = 'all'
            # q == all -> Return all directories and layers
            # q == l -> Return all layers
            # q == d -> Return all directories
            if 'q' in request.args:
                q = request.args['q'].lower()
            
            return jsonify({'data':build_tree(cursor,root,depth)})

            #if q == 'all':
            #    sql = "select * from dir2 where path ~ '%s.*{1,%d}'" % (root, depth)                    
            #elif q == 'd':
            #    sql = "select * from dir2 where path ~ '%s.*{0,%d}.D*'" % (root, depth-1)
            #elif q == 'l':
            #    sql = "select * from dir2 where path ~ '%s.*{0,%d}.L*'" % (root, depth-1)
            #else:
            #    abort(404)
            #
            ##sql = "select * from dir1 where path ~ '%s.*{0,%d}'" % (root,depth)
            #cursor.execute(sql)
            #results = cursor.fetchall()
            #btresponse = {}
            #btresponse['type'] = 'btresponse'
            #btresponse['root'] = root
            #btresponse['depth'] = depth
            #btresponse['tree'] = []
            #for i,row in enumerate(results):
            #    btresponse['tree'].append({'label':row[2],'id':row[0],'path':row[1]})
            ##select * from test where path ~ 'Top.*{1}';
            #return jsonify(btresponse)
        else:
            abort(404)

        return jsonify({'response':'hello world'})
