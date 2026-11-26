import numpy as np, json
from scipy import stats
R={}
x1=[148,154,158,160,161,162,166,170,182,195,236]
x2=[2.1,2.4,2.6,2.8,3.0,3.1,3.3,3.5,3.8,4.2,5.9]
x3=[0.1,0.9,1.3,2.2,2.9,3.1,4.8,5.0,7.7,9.3,9.9,12.4,15.5,16.0,21.7,30.2]
x4=[1,2,3]
x5=list(np.round(np.random.RandomState(5).normal(10,2,60),3))
for k,x in dict(a=x1,b=x2,c=x3,d=x4,e=x5).items():
    w,p=stats.shapiro(x);R['sw_'+k]=dict(x=[float(v) for v in x],W=w,p=p)
A=[12,15,11,18,14,16,13];B=[19,22,17,25,21,20,24]
for m in ['exact','asymptotic']:
    r=stats.mannwhitneyu(A,B,method=m,use_continuity=True);R['mw_'+m]=dict(U=min(r.statistic,len(A)*len(B)-r.statistic),p=r.pvalue)
At=[1,2,2,3,4,5,5,6,7];Bt=[3,5,6,6,8,9,9,10]
r=stats.mannwhitneyu(At,Bt,method='asymptotic',use_continuity=True);R['mw_ties']=dict(A=At,B=Bt,U1=r.statistic,p=r.pvalue)
b=[125,130,118,141,135,128,122,133];a=[120,126,119.5,132,134,125.5,121.2,128.7]
r=stats.wilcoxon(b,a,method='exact');R['wx_exact']=dict(b=b,a=a,T=r.statistic,p=r.pvalue)
b2=[1.5,2.5,2.5,3.5,4.5,-1,0,2,3.5,6];r=stats.wilcoxon(b2,method='approx',correction=True,zero_method='wilcox');R['wx_ties']=dict(d=b2,T=r.statistic,p=r.pvalue)
g=[[12,15,11,18,14],[19,22,17,25,21],[13,16,14,20,15]]
r=stats.kruskal(*g);R['kw']=dict(g=g,H=r.statistic,p=r.pvalue)
gt=[[1,2,2,3],[2,3,4,4,5],[5,5,6,7]];r=stats.kruskal(*gt);R['kw_ties']=dict(g=gt,H=r.statistic,p=r.pvalue)
r=stats.f_oneway(*g);R['an']=dict(F=r.statistic,p=r.pvalue)
# regression
rs=np.random.RandomState(1);X=rs.normal(size=(30,3));y=1+2*X[:,0]-X[:,1]+.5*X[:,2]+rs.normal(0,.5,30)
Xd=np.column_stack([np.ones(30),X]);beta,res,rk,sv=np.linalg.lstsq(Xd,y,rcond=None);fit=Xd@beta;sse=((y-fit)**2).sum();sst=((y-y.mean())**2).sum();df=26;s2=sse/df
cov=s2*np.linalg.inv(Xd.T@Xd);se=np.sqrt(np.diag(cov));tt=beta/se;pp=2*stats.t.sf(abs(tt),df)
F=((sst-sse)/3)/s2
R['ols']=dict(X=X.round(6).tolist(),y=y.round(6).tolist(),beta=None)
Xr=np.array(R['ols']['X']);yr=np.array(R['ols']['y']);Xd=np.column_stack([np.ones(30),Xr]);beta=np.linalg.lstsq(Xd,yr,rcond=None)[0];fit=Xd@beta;sse=((yr-fit)**2).sum();sst=((yr-yr.mean())**2).sum();s2=sse/26;cov=s2*np.linalg.inv(Xd.T@Xd);se=np.sqrt(np.diag(cov));tt=beta/se
R['ols'].update(beta=beta.tolist(),se=se.tolist(),p=(2*stats.t.sf(abs(tt),26)).tolist(),R2=1-sse/sst,F=((sst-sse)/3)/s2,pF=stats.f.sf(((sst-sse)/3)/s2,3,26))
# poly
xp=np.linspace(0,10,15);yp=(1+.5*xp-.2*xp**2+np.random.RandomState(2).normal(0,.8,15)).round(5)
cf=np.polyfit(xp,yp,2);R['poly']=dict(x=xp.tolist(),y=yp.tolist(),pred=[float(np.polyval(cf,v)) for v in [0,2.5,7.5,10]])
# huber IRLS independent (numpy)
xh=np.arange(1,16.);yh=2+3*xh;yh[[3,11]]+=[40,-35];Xh=np.column_stack([np.ones(15),xh]);w=np.ones(15)
for _ in range(500):
    sw=np.sqrt(w);b=np.linalg.lstsq(Xh*sw[:,None],yh*sw,rcond=None)[0];r=yh-Xh@b;sc=np.median(abs(r))/0.6744897501960817;u=abs(r)/sc;w=np.where(u<=1.345,1,1.345/np.maximum(u,1e-300))
R['huber']=dict(x=xh.tolist(),y=yh.tolist(),beta=b.tolist())
# power
def pw(d,n,two=True):
    from scipy.stats import nct,t
    if two: nu=2*n-2;nc=d*np.sqrt(n/2)
    else: nu=n-1;nc=d*np.sqrt(n)
    c=t.ppf(.975,nu);return nct.sf(c,nu,nc)+nct.cdf(-c,nu,nc)
R['pw']=[dict(d=.5,n=30,kind='two',p=pw(.5,30)),dict(d=.8,n=15,kind='two',p=pw(.8,15)),dict(d=.5,n=10,kind='one',p=pw(.5,10,False)),dict(d=.2,n=400,kind='two',p=pw(.2,400))]
# n for power .8 d=.5 two
n=2
while pw(.5,n)<.8:n+=1
R['pw_n']=n
# correlation
c=np.random.RandomState(9).normal(size=(25,3));c[:,1]+=c[:,0]*.7;R['cm']=dict(c=c.round(5).tolist())
cc=np.array(R['cm']['c']);R['cm']['pear']=np.corrcoef(cc.T).tolist();sr=stats.spearmanr(cc)[0];R['cm']['spear']=np.asarray(sr).tolist();R['cm']['p01']=stats.pearsonr(cc[:,0],cc[:,1])[1];R['cm']['sp01']=stats.spearmanr(cc[:,0],cc[:,1])[1]
json.dump(R,open('ref_stats.json','w'),default=float)
print({k:(v if not isinstance(v,dict) else {kk:vv for kk,vv in v.items() if kk in('W','p','U','H','T','F','beta')}) for k,v in R.items() if k not in('ols','poly','huber','cm','pw')})
print(R['pw'],R['pw_n'])
